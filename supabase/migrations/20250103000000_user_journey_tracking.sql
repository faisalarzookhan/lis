-- Migration: Add user journey tracking
-- Description: Creates tables to track user interactions and journeys for analytics
-- Priority: Medium (Analytics & Monitoring)

-- Create user sessions table (extends existing analytics_events)
CREATE TABLE public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL,
    device_type TEXT, -- 'desktop', 'mobile', 'tablet'
    browser TEXT,
    os TEXT,
    screen_resolution TEXT,
    timezone TEXT,
    language TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    entry_page TEXT,
    exit_page TEXT,
    page_views INTEGER DEFAULT 0,
    duration_seconds INTEGER DEFAULT 0,
    is_bounce BOOLEAN DEFAULT FALSE,
    completed_goals JSONB DEFAULT '[]'::jsonb, -- Array of completed goal IDs
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, session_id)
);

-- Create page views table
CREATE TABLE public.page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    page_url TEXT NOT NULL,
    page_title TEXT,
    time_on_page INTEGER, -- seconds
    scroll_depth DECIMAL(5,2), -- percentage 0-100
    referrer TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create user events table
CREATE TABLE public.user_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL, -- 'click', 'form_submit', 'download', 'share', etc.
    event_category TEXT, -- 'engagement', 'conversion', 'interaction'
    event_label TEXT,
    event_value INTEGER,
    page_url TEXT,
    element_selector TEXT, -- CSS selector of clicked element
    element_text TEXT, -- Text content of clicked element
    custom_data JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create goals/funnels table
CREATE TABLE public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    goal_type TEXT NOT NULL CHECK (goal_type IN ('page_view', 'event', 'duration', 'scroll')),
    target_value TEXT NOT NULL, -- URL pattern, event name, duration in seconds, scroll percentage
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create goal conversions table
CREATE TABLE public.goal_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    conversion_value DECIMAL(10,2), -- monetary value if applicable
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_session_id ON public.user_sessions(session_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_created_at ON public.user_sessions(created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_page_views_session_id ON public.page_views(session_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_page_views_user_id ON public.page_views(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_page_views_timestamp ON public.page_views(timestamp DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_events_session_id ON public.user_events(session_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_events_user_id ON public.user_events(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_events_event_type ON public.user_events(event_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_events_timestamp ON public.user_events(timestamp DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_goal_conversions_goal_id ON public.goal_conversions(goal_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_goal_conversions_session_id ON public.goal_conversions(session_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_goal_conversions_timestamp ON public.goal_conversions(timestamp DESC);

-- Enable RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_conversions ENABLE ROW LEVEL SECURITY;

-- Public read for anonymous analytics (aggregated data only)
-- Admin read for detailed analytics
CREATE POLICY "user_sessions_admin_read" ON public.user_sessions FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'moderator')
);
CREATE POLICY "page_views_admin_read" ON public.page_views FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'moderator')
);
CREATE POLICY "user_events_admin_read" ON public.user_events FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'moderator')
);
CREATE POLICY "goals_admin_all" ON public.goals FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'moderator')
);
CREATE POLICY "goal_conversions_admin_read" ON public.goal_conversions FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'moderator')
);

-- Allow anonymous inserts for tracking
CREATE POLICY "user_sessions_anon_insert" ON public.user_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "page_views_anon_insert" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "user_events_anon_insert" ON public.user_events FOR INSERT WITH CHECK (true);
CREATE POLICY "goal_conversions_anon_insert" ON public.goal_conversions FOR INSERT WITH CHECK (true);

-- Functions for analytics
CREATE OR REPLACE FUNCTION public.track_page_view(
    p_session_id TEXT,
    p_page_url TEXT,
    p_page_title TEXT DEFAULT NULL,
    p_referrer TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    view_id UUID;
BEGIN
    INSERT INTO public.page_views (session_id, user_id, page_url, page_title, referrer)
    VALUES (p_session_id, auth.uid(), p_page_url, p_page_title, p_referrer)
    RETURNING id INTO view_id;

    -- Update session page views count
    UPDATE public.user_sessions
    SET page_views = page_views + 1,
        updated_at = NOW()
    WHERE session_id = p_session_id;

    RETURN view_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.track_user_event(
    p_session_id TEXT,
    p_event_type TEXT,
    p_event_category TEXT DEFAULT NULL,
    p_event_label TEXT DEFAULT NULL,
    p_event_value INTEGER DEFAULT NULL,
    p_page_url TEXT DEFAULT NULL,
    p_custom_data JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO public.user_events (
        session_id, user_id, event_type, event_category, event_label,
        event_value, page_url, custom_data
    ) VALUES (
        p_session_id, auth.uid(), p_event_type, p_event_category, p_event_label,
        p_event_value, p_page_url, p_custom_data
    )
    RETURNING id INTO event_id;

    RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.track_page_view TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_user_event TO anon, authenticated;
