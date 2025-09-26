/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                    COMPLETE SUPABASE SCHEMA SETUP                            ║
║                    Limitless Infotech Solution                               ║
║                                                                              ║
║  This script creates the complete database schema for the Limitless          ║
║  Infotech Solution.                                                          ║
║                                                                              ║
║  ⚠️  WARNING: This will DROP existing tables! Backup your data first!       ║
║                                                                            ║
║  To use: Copy entire script → Supabase SQL Editor → Run                    ║
║                                                                            ║
║  Version: 2.1.0 - Fixed and Simplified                                    ║
║  Last Updated: 2024-12-19                                                 ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/

-- =============================================================================
-- CONFIGURATION SECTION
-- =============================================================================

-- Set timezone and other session settings
SET timezone = 'UTC';
SET search_path TO public;

-- =============================================================================
-- STEP 1: CLEANUP - Drop all existing tables (DESTRUCTIVE OPERATION)
-- =============================================================================

DO $$
DECLARE
    table_name TEXT;
BEGIN
    -- Drop tables in reverse dependency order
    FOR table_name IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename IN (
            'notifications', 'analytics_events', 'email_logs', 'file_uploads',
            'faqs', 'knowledge_base', 'chat_feedback', 'chat_messages', 'chat_sessions',
            'profiles', 'leads', 'pages', 'projects', 'services', 'testimonials', 'team_members'
        )
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || table_name || ' CASCADE';
        RAISE NOTICE 'Dropped table: %', table_name;
    END LOOP;
END $$;

-- =============================================================================
-- STEP 2: ENABLE EXTENSIONS
-- =============================================================================

-- Enable required extensions (removed vector extension for compatibility)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- =============================================================================
-- STEP 3: CREATE TABLES
-- =============================================================================

-- Core Content Tables
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 100),
    description TEXT NOT NULL CHECK (char_length(description) >= 10 AND char_length(description) <= 1000),
    icon TEXT NOT NULL CHECK (char_length(icon) >= 2),
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    benefits TEXT NOT NULL CHECK (char_length(benefits) >= 10),
    link TEXT NOT NULL DEFAULT '#',
    slug TEXT GENERATED ALWAYS AS (lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'))) STORED UNIQUE,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
    role TEXT NOT NULL CHECK (char_length(role) >= 2 AND char_length(role) <= 100),
    bio TEXT NOT NULL CHECK (char_length(bio) >= 10 AND char_length(bio) <= 500),
    image TEXT,
    email TEXT CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    linkedin_url TEXT,
    github_url TEXT,
    twitter_url TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
    role TEXT NOT NULL CHECK (char_length(role) >= 2),
    company TEXT NOT NULL CHECK (char_length(company) >= 2),
    content TEXT NOT NULL CHECK (char_length(content) >= 10 AND char_length(content) <= 1000),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    image TEXT,
    website_url TEXT,
    project_url TEXT,
    approved BOOLEAN DEFAULT FALSE NOT NULL,
    featured BOOLEAN DEFAULT FALSE NOT NULL,
    page_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ
);

CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 200),
    description TEXT NOT NULL CHECK (char_length(description) >= 10),
    industry TEXT NOT NULL,
    service_type TEXT NOT NULL,
    project_size TEXT NOT NULL CHECK (project_size IN ('Small', 'Medium', 'Large', 'Enterprise')),
    image TEXT NOT NULL,
    challenge TEXT NOT NULL CHECK (char_length(challenge) >= 10),
    solution TEXT NOT NULL CHECK (char_length(solution) >= 10),
    tech_stack JSONB NOT NULL DEFAULT '[]'::jsonb,
    results JSONB NOT NULL DEFAULT '{}'::jsonb,
    client_review JSONB,
    testimonial_id UUID REFERENCES public.testimonials(id),
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    featured BOOLEAN DEFAULT FALSE NOT NULL,
    version INTEGER DEFAULT 1 NOT NULL,
    slug TEXT GENERATED ALWAYS AS (lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'))) STORED UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Admin Panel Tables
CREATE TABLE public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_name TEXT NOT NULL UNIQUE CHECK (char_length(page_name) >= 2),
    title TEXT NOT NULL CHECK (char_length(title) >= 3),
    content JSONB DEFAULT '{}'::jsonb,
    meta_description TEXT CHECK (char_length(meta_description) <= 160),
    meta_keywords TEXT[],
    slug TEXT GENERATED ALWAYS AS (lower(regexp_replace(page_name, '[^a-zA-Z0-9]+', '-', 'g'))) STORED UNIQUE,
    version INTEGER DEFAULT 1 NOT NULL,
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_basics JSONB DEFAULT '{}'::jsonb,
    project_details JSONB DEFAULT '{}'::jsonb,
    timeline_budget JSONB DEFAULT '{}'::jsonb,
    contact_info JSONB DEFAULT '{}'::jsonb,
    source_page TEXT,
    source_url TEXT,
    user_agent TEXT,
    ip_address INET,
    lead_score INTEGER DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost', 'archived')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID REFERENCES auth.users(id),
    notes TEXT,
    follow_up_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_by UUID REFERENCES auth.users(id)
);

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'admin', 'moderator')),
    full_name TEXT CHECK (char_length(full_name) >= 2 AND char_length(full_name) <= 100),
    avatar_url TEXT,
    phone TEXT,
    company TEXT,
    job_title TEXT,
    bio TEXT CHECK (char_length(bio) <= 500),
    timezone TEXT DEFAULT 'UTC',
    email_verified BOOLEAN DEFAULT FALSE NOT NULL,
    last_login_at TIMESTAMPTZ,
    login_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL CHECK (char_length(question) >= 5 AND char_length(question) <= 200),
    answer TEXT NOT NULL CHECK (char_length(answer) >= 10 AND char_length(answer) <= 2000),
    category TEXT CHECK (char_length(category) >= 2),
    tags TEXT[] DEFAULT '{}'::text[],
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    display_order INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    CONSTRAINT faqs_question_unique UNIQUE (question)
);

-- Chatbot Tables
CREATE TABLE public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_token TEXT UNIQUE,
    user_info JSONB DEFAULT '{}'::jsonb,
    message_count INTEGER DEFAULT 0,
    last_message_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    message_index INTEGER NOT NULL,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'bot', 'system')),
    content TEXT NOT NULL,
    structured_data JSONB,
    suggestions TEXT[],
    tokens_used INTEGER,
    response_time_ms INTEGER,
    feedback_rating TEXT CHECK (feedback_rating IN ('positive', 'negative', 'neutral')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT chat_messages_session_index_unique UNIQUE (session_id, message_index)
);

CREATE TABLE public.chat_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    rating TEXT NOT NULL CHECK (rating IN ('positive', 'negative', 'neutral')),
    feedback_text TEXT,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL CHECK (char_length(title) >= 3),
    content TEXT NOT NULL CHECK (char_length(content) >= 10),
    category TEXT CHECK (char_length(category) >= 2),
    tags TEXT[] DEFAULT '{}'::text[],
    source_url TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    view_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Additional Feature Tables
CREATE TABLE public.file_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id),
    related_table TEXT,
    related_id UUID,
    is_public BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    to_email TEXT NOT NULL,
    from_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT,
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'bounced', 'complained')),
    provider_message_id TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    delivered_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    related_table TEXT,
    related_id UUID
);

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('lead', 'message', 'system', 'reminder')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    user_id UUID REFERENCES auth.users(id),
    session_id TEXT,
    page_url TEXT,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =============================================================================
-- STEP 4: CREATE INDEXES FOR PERFORMANCE
-- =============================================================================

-- Basic indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_is_active ON public.services(is_active) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_team_members_is_active ON public.team_members(is_active) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_testimonials_approved ON public.testimonials(approved) WHERE approved = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_testimonials_featured ON public.testimonials(featured) WHERE featured = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_is_published ON public.projects(is_published) WHERE is_published = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_featured ON public.projects(featured) WHERE featured = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_industry ON public.projects(industry);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pages_is_published ON public.pages(is_published) WHERE is_published = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_priority ON public.leads(priority);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_faqs_category ON public.faqs(category);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_faqs_is_featured ON public.faqs(is_featured) WHERE is_featured = true;

-- Chat indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_sessions_is_active ON public.chat_sessions(is_active) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_messages_sender ON public.chat_messages(sender);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_feedback_message_id ON public.chat_feedback(message_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_feedback_rating ON public.chat_feedback(rating);

-- Knowledge base indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_knowledge_base_category ON public.knowledge_base(category);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_knowledge_base_is_active ON public.knowledge_base(is_active) WHERE is_active = true;

-- Additional feature indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_file_uploads_related ON public.file_uploads(related_table, related_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_email_logs_status ON public.email_logs(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_email_logs_sent_at ON public.email_logs(sent_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read) WHERE is_read = false;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at DESC);

-- Full-text search indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_fts ON public.services USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_fts ON public.projects USING gin(to_tsvector('english', title || ' ' || description || ' ' || challenge || ' ' || solution));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_faqs_fts ON public.faqs USING gin(to_tsvector('english', question || ' ' || answer));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_knowledge_base_fts ON public.knowledge_base USING gin(to_tsvector('english', title || ' ' || content));

-- =============================================================================
-- STEP 5: ENABLE ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- STEP 6: CREATE RLS POLICIES
-- =============================================================================

-- Public read access for content tables
CREATE POLICY "services_public_read" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "team_members_public_read" ON public.team_members FOR SELECT USING (is_active = true);
CREATE POLICY "testimonials_public_read" ON public.testimonials FOR SELECT USING (approved = true);
CREATE POLICY "projects_public_read" ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "pages_public_read" ON public.pages FOR SELECT USING (is_published = true);
CREATE POLICY "faqs_public_read" ON public.faqs FOR SELECT USING (true);

-- Anonymous insert for forms
CREATE POLICY "testimonials_anon_insert" ON public.testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "leads_anon_insert" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "analytics_events_anon_insert" ON public.analytics_events FOR INSERT WITH CHECK (true);

-- Authenticated user policies
CREATE POLICY "profiles_user_read" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_user_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Chat policies for users
CREATE POLICY "chat_sessions_user_all" ON public.chat_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "chat_messages_user_all" ON public.chat_messages FOR ALL
  USING ((SELECT user_id FROM public.chat_sessions WHERE id = session_id) = auth.uid());
CREATE POLICY "chat_feedback_user_all" ON public.chat_feedback FOR ALL
  USING ((SELECT user_id FROM public.chat_sessions WHERE id = session_id) = auth.uid());

-- Notification policies
CREATE POLICY "notifications_user_all" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- File upload policies
CREATE POLICY "file_uploads_user_read" ON public.file_uploads FOR SELECT USING (auth.uid() = uploaded_by OR is_public = true);

-- Admin policies
CREATE POLICY "services_admin_all" ON public.services FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'moderator')
);
CREATE POLICY "projects_admin_all" ON public.projects FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'moderator')
);
CREATE POLICY "pages_admin_all" ON public.pages FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'moderator')
);
CREATE POLICY "leads_admin_all" ON public.leads FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'moderator')
);
CREATE POLICY "testimonials_admin_all" ON public.testimonials FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'moderator')
);
CREATE POLICY "team_members_admin_all" ON public.team_members FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'moderator')
);
CREATE POLICY "faqs_admin_all" ON public.faqs FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'moderator')
);
CREATE POLICY "knowledge_base_admin_all" ON public.knowledge_base FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'moderator')
);
CREATE POLICY "file_uploads_admin_all" ON public.file_uploads FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'moderator')
);
CREATE POLICY "email_logs_admin_read" ON public.email_logs FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'moderator')
);
CREATE POLICY "analytics_events_admin_read" ON public.analytics_events FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'moderator')
);
CREATE POLICY "profiles_admin_all" ON public.profiles FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- =============================================================================
-- STEP 7: CREATE FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate slugs
CREATE OR REPLACE FUNCTION public.generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(input_text, '[^a-zA-Z0-9]+', '-', 'g'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update lead score
CREATE OR REPLACE FUNCTION public.calculate_lead_score(lead_id UUID)
RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
    lead_record RECORD;
BEGIN
    SELECT * INTO lead_record FROM public.leads WHERE id = lead_id;

    -- Base scoring logic
    IF lead_record.business_basics->>'company_size' = 'enterprise' THEN score := score + 20; END IF;
    IF lead_record.project_details->>'urgency' = 'urgent' THEN score := score + 15; END IF;
    IF lead_record.timeline_budget->>'budget_range' = 'high' THEN score := score + 10; END IF;

    -- Ensure score is within bounds
    RETURN GREATEST(0, LEAST(100, score));
END;
$$ LANGUAGE plpgsql;

-- Function to create notifications
CREATE OR REPLACE FUNCTION public.create_notification(
    p_user_id UUID,
    p_type TEXT,
    p_title TEXT,
    p_message TEXT,
    p_data JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO public.notifications (user_id, type, title, message, data)
    VALUES (p_user_id, p_type, p_title, p_message, p_data)
    RETURNING id INTO notification_id;

    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log analytics events
CREATE OR REPLACE FUNCTION public.log_analytics_event(
    p_event_type TEXT,
    p_event_data JSONB DEFAULT '{}'::jsonb,
    p_user_id UUID DEFAULT NULL,
    p_session_id TEXT DEFAULT NULL,
    p_page_url TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO public.analytics_events (
        event_type, event_data, user_id, session_id,
        page_url, user_agent, ip_address
    ) VALUES (
        p_event_type, p_event_data, p_user_id, p_session_id,
        p_page_url, p_user_agent, p_ip_address
    )
    RETURNING id INTO event_id;

    RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update chat session stats
CREATE OR REPLACE FUNCTION public.update_chat_session_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.chat_sessions
        SET message_count = message_count + 1,
            last_message_at = NEW.created_at,
            updated_at = NOW()
        WHERE id = NEW.session_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (new.id, new.email, 'user', new.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle lead status changes
CREATE OR REPLACE FUNCTION public.handle_lead_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status != NEW.status THEN
        -- Log status change in analytics
        PERFORM public.log_analytics_event(
            'lead_status_changed',
            jsonb_build_object(
                'lead_id', NEW.id,
                'old_status', OLD.status,
                'new_status', NEW.status,
                'changed_by', NEW.updated_by
            ),
            NEW.updated_by
        );

        -- Create notification for assigned user
        IF NEW.assigned_to IS NOT NULL AND NEW.status IN ('qualified', 'proposal', 'urgent') THEN
            PERFORM public.create_notification(
                NEW.assigned_to,
                'lead',
                'Lead Status Updated',
                format('Lead status changed to %s', NEW.status),
                jsonb_build_object('lead_id', NEW.id)
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers
CREATE TRIGGER trigger_services_updated_at BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_team_members_updated_at BEFORE UPDATE ON public.team_members
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_testimonials_updated_at BEFORE UPDATE ON public.testimonials
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_pages_updated_at BEFORE UPDATE ON public.pages
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_leads_updated_at BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_faqs_updated_at BEFORE UPDATE ON public.faqs
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_knowledge_base_updated_at BEFORE UPDATE ON public.knowledge_base
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_file_uploads_updated_at BEFORE UPDATE ON public.file_uploads
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Special triggers
CREATE TRIGGER trigger_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE TRIGGER trigger_chat_message_insert
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_chat_session_stats();

CREATE TRIGGER trigger_lead_status_change
  AFTER UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_lead_status_change();

-- =============================================================================
-- STEP 8: GRANT PERMISSIONS
-- =============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant permissions on all tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- Grant execute on specific functions
GRANT EXECUTE ON FUNCTION public.generate_slug TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_lead_score TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_notification TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_analytics_event TO anon, authenticated;

-- =============================================================================
-- STEP 9: INSERT INITIAL SEED DATA
-- =============================================================================

-- Seed Services
INSERT INTO public.services (title, description, icon, features, benefits, link, display_order) VALUES
('Web Development', 'Responsive, high-performing websites that align with your brand identity. Optimized for speed, functionality, and SEO.', 'MonitorSmartphone', '["Responsive design", "SEO optimization", "Speed optimization", "Brand consistency", "Mobile-first approach", "Performance monitoring"]', 'Boost online visibility, reduce bounce rates, and build a foundation for scalable growth with modern web technologies.', '#services/web-development', 1),
('Mobile App Development', 'Native (iOS/Android) and hybrid apps with intuitive UI/UX. Built for performance, security, and cross-platform compatibility.', 'Smartphone', '["Native/hybrid development", "UI/UX optimization", "App Store compliance", "Push notifications", "Offline functionality", "Cross-platform compatibility"]', 'Expand your reach, enhance customer engagement, and drive revenue through mobile-first strategies with seamless user experiences.', '#services/mobile-development', 2),
('Custom Software & Systems', 'Tailor-made internal systems to digitize operations, eliminate bottlenecks, and supercharge productivity.', 'Code', '["Workflow automation", "Scalable architecture", "Custom integrations (ERP, CRM)", "API development", "Database design", "Cloud deployment"]', 'Streamline operations, reduce manual effort, and gain full control over your systems with bespoke software solutions.', '#services/custom-software', 3),
('AI & Automation Solutions', 'Automate repetitive tasks, leverage AI for data insights, and integrate APIs to create intelligent workflows.', 'BrainCircuit', '["AI-driven analytics", "API integrations", "IoT solutions", "Machine learning", "Predictive modeling", "Intelligent automation"]', 'Cut costs, boost accuracy, and future-proof your business with intelligent automation and AI-powered decision making.', '#services/ai-automation', 4),
('CRM & Task Management', 'Intelligent CRM and task tracking platforms that give you complete visibility into team performance and customer interactions.', 'Users', '["Real-time task alerts", "Performance analytics", "Multi-user access control", "Lead tracking", "Customer insights", "Automated workflows"]', 'Track leads, manage teams, and grow relationships—all in one intuitive platform with advanced analytics and automation.', '#services/crm-management', 5),
('Logo & Brand Design', 'Creative logo design services to establish a strong brand identity and make a lasting impression.', 'Brush', '["Custom logo design", "Brand identity development", "Versatile logo formats", "Color psychology", "Typography selection", "Brand guidelines"]', 'Stand out from the competition and create a memorable brand image that resonates with your target audience.', '#services/logo-design', 6),
('Business Process Automation', 'Leverage AI, APIs, and automation tools to simplify complex operations, reduce human error, and unlock data-driven decisions.', 'Settings', '["Process mapping", "Workflow automation", "AI-driven predictive analytics", "API integrations", "IoT device management", "Real-time monitoring"]', 'Transform your business operations with intelligent automation that reduces costs, improves accuracy, and scales with your growth.', '#services/business-automation', 7);

-- Seed Team Members
INSERT INTO public.team_members (name, role, bio, image, email, linkedin_url, display_order) VALUES
('Faisal Khan', 'Founder & CEO', 'Visionary with 15+ years in tech, bridging the gap between innovation and practical business outcomes. Expert in digital transformation and strategic technology leadership.', 'https://i.pravatar.cc/150?u=faisal', 'faisal@limitlessinfotech.com', 'https://linkedin.com/in/faisal-khan', 1),
('Taj Nadaf', 'CTO & Co-Founder', 'Expert in software development, specializing in scalable cloud architectures and cutting-edge technologies. Passionate about building robust, future-proof solutions.', 'https://i.pravatar.cc/150?u=taj', 'taj@limitlessinfotech.com', 'https://linkedin.com/in/taj-nadaf', 2),
('Sarah Johnson', 'Lead Developer', 'Full-stack developer with expertise in React, Node.js, and cloud technologies. Focused on creating exceptional user experiences and scalable applications.', 'https://i.pravatar.cc/150?u=sarah', 'sarah@limitlessinfotech.com', 'https://linkedin.com/in/sarah-johnson', 3),
('Mike Chen', 'UI/UX Designer', 'Creative designer specializing in user-centered design and brand identity. Transforms complex ideas into intuitive, beautiful interfaces.', 'https://i.pravatar.cc/150?u=mike', 'mike@limitlessinfotech.com', 'https://linkedin.com/in/mike-chen', 4);

-- Seed Testimonials
INSERT INTO public.testimonials (name, role, company, content, rating, image, website_url, approved, featured) VALUES
('A. Verma', 'CFO', 'FintechPro', 'Outstanding solutions, exceeded all metrics. Limitless delivered a secure, scalable platform that transformed our operations. The attention to detail and technical expertise is unmatched.', 5, 'https://i.pravatar.cc/150?u=verma', 'https://fintechpro.com', TRUE, TRUE),
('R. Singh', 'Operations Lead', 'MediCare Inc.', 'Supportive, modern, and efficient team. Their custom software reduced our workflow bottlenecks by 40%. The implementation was seamless and the results exceeded expectations.', 5, 'https://i.pravatar.cc/150?u=singh', 'https://medicare.com', TRUE, TRUE),
('K. Mehra', 'CEO', 'TechPivot', 'Limitless helped us scale reliably. Their AI integration cut our manual tasks by 50%—game-changing. The team''s expertise in automation transformed our business operations.', 5, 'https://i.pravatar.cc/150?u=mehra', 'https://techpivot.com', TRUE, TRUE);

-- Seed Projects
INSERT INTO public.projects (title, description, industry, service_type, project_size, image, challenge, solution, tech_stack, results, is_published, featured) VALUES
('EduWorks LMS', 'Custom Learning Management System for 50K+ learners, built with scalability and compliance.', 'Education', 'Custom Software', 'Enterprise', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', 'EduWorks struggled with a legacy LMS—slow load times, limited user tracking, and compliance gaps.', 'We developed a cloud-based LMS with AI-driven analytics, role-based access, and GDPR/HIPAA compliance.', '["React", "Node.js", "AWS", "PostgreSQL"]', '["Reduced load time by 60%", "Increased user engagement by 45%", "Achieved 100% compliance"]', TRUE, TRUE),
('FintechPro Mobile App', 'A secure mobile banking app with biometric login and real-time transaction alerts.', 'Finance', 'Mobile App Development', 'Growth', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80', 'Needed a highly secure, user-friendly mobile app to compete with larger banks.', 'Built a native iOS/Android app with multi-layer security, intuitive UI, and seamless API integrations.', '["SwiftUI", "Kotlin", "Supabase", "Stripe"]', '["20% increase in mobile users", "99.9% uptime", "5-star App Store rating"]', TRUE, TRUE);
-- Seed Pages
INSERT INTO public.pages (page_name, title, content, meta_description, is_published) VALUES
('home', 'Limitless Infotech - Innovative Technology Solutions', '{"hero": {"title": "Welcome to Limitless Infotech", "subtitle": "Transforming businesses through innovative technology solutions"}}', 'Leading technology company specializing in web development, mobile apps, AI automation, and custom software solutions.', TRUE),
('about', 'About Limitless Infotech - Our Story & Mission', '{"mission": "To empower businesses with cutting-edge technology solutions that drive growth and innovation."}', 'Learn about Limitless Infotech''s mission to deliver exceptional technology solutions and transform businesses worldwide.', TRUE),
('services', 'Our Services - Comprehensive Technology Solutions', '{"overview": "Comprehensive technology services tailored to your needs"}', 'Explore our full range of technology services including web development, mobile apps, AI automation, and custom software.', TRUE),
('contact', 'Contact Us - Get In Touch With Our Experts', '{"info": "Get in touch with our expert team for your next technology project."}', 'Ready to start your technology project? Contact Limitless Infotech today for a free consultation.', TRUE);

-- Seed FAQs
INSERT INTO public.faqs (question, answer, category, tags, is_featured) VALUES
('What services do you offer?', 'We offer web development, mobile app development, custom software, AI automation, CRM systems, and logo design. Our comprehensive technology solutions are designed to meet diverse business needs.', 'services', '{"services", "overview"}', TRUE),
('How long does a typical project take?', 'Project timelines vary based on complexity, but most projects range from 4-12 weeks. We provide detailed timelines during our initial consultation and keep you updated throughout the development process.', 'general', '{"timeline", "process"}', TRUE),
('Do you provide ongoing support?', 'Yes, we offer post-launch maintenance and support packages to ensure your solution continues to perform optimally. Our support includes bug fixes, updates, and performance monitoring.', 'support', '{"maintenance", "support"}', TRUE),
('What is your development process?', 'Our process includes discovery, planning, design, development, testing, and deployment with regular client communication. We use agile methodologies to ensure transparency and collaboration.', 'process', '{"methodology", "agile"}', TRUE),
('Can you work with our existing systems?', 'Absolutely! We specialize in integrations and can work with your current tech stack. Our team has experience with various platforms and can ensure seamless integration.', 'integrations', '{"integration", "compatibility"}', TRUE),
('What technologies do you use?', 'We use modern, scalable technologies including React, Node.js, Python, AWS, Supabase, and more. We choose the best tools for each project based on specific requirements.', 'technology', '{"tech-stack", "tools"}', FALSE),
('Do you offer custom solutions?', 'Yes, we excel at creating custom solutions tailored to your unique business needs. Every project is approached with your specific goals and requirements in mind.', 'customization', '{"bespoke", "tailored"}', FALSE);

-- Seed Knowledge Base
INSERT INTO public.knowledge_base (title, content, category, tags) VALUES
('Company Overview', 'Limitless Infotech specializes in web development, mobile apps, custom software, CRM systems, and AI automation. Founded with a vision to bridge the gap between technology and business success.', 'company_info', '{"company", "overview", "mission"}'),
('Service Offerings', 'Our services include responsive web design, SEO optimization, mobile app development, custom software solutions, AI automation, and brand identity design.', 'services', '{"services", "offerings", "capabilities"}'),
('Industry Expertise', 'We have successfully delivered projects for education, finance, healthcare, and technology industries. Our cross-industry experience enables us to understand diverse business needs.', 'portfolio', '{"industries", "experience", "expertise"}'),
('Technology Stack', 'We leverage modern technologies including React, Node.js, Python, AWS, Supabase, and various AI/ML frameworks to build scalable, high-performance solutions.', 'technology', '{"tech-stack", "tools", "frameworks"}'),
('Development Process', 'Our agile development process ensures transparency, collaboration, and quality. We follow industry best practices with regular communication and iterative development.', 'process', '{"methodology", "agile", "best-practices"}');

-- =============================================================================
-- SETUP COMPLETE!
-- =============================================================================

/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                           🎉 SETUP COMPLETE!                               ║
║                                                                            ║
║  Your Supabase database is now fully configured with:                     ║
║  ✅ 16 tables with comprehensive relationships and constraints            ║
║  ✅ Advanced Row Level Security policies                                  ║
║  ✅ Performance indexes                                                   ║
║  ✅ Automated triggers and functions                                      ║
║  ✅ Analytics and notification systems                                    ║
║  ✅ File upload and email logging capabilities                            ║
║  ✅ Enhanced seed data with proper JSON formatting                        ║
║  ✅ Full-text search capabilities                                         ║
║                                                                            ║
║  Key Changes Made:                                                        ║
║  • Removed vector extension for better compatibility                      ║
║  • Fixed malformed JSON in seed data                                      ║
║  • Simplified setup for broader Supabase plan support                     ║
║                                                                            ║
║  Next steps:                                                              ║
║  1. Regenerate TypeScript types:                                          ║
║     npx supabase gen types typescript --project-id YOUR_PROJECT_ID         ║
║  2. Update your src/types/supabase.ts file                                ║
║  3. Test your application                                                 ║
║  4. Set up monitoring and backups                                         ║
║                                                                            ║
║  🚀 Ready to build amazing things!                                        ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/
-- Seed Pages
INSERT INTO public.pages (page_name, title, content, meta_description, is_published) VALUES
('home', 'Limitless Infotech - Innovative Technology Solutions', '{"hero": {"title": "Welcome to Limitless Infotech", "subtitle": "Transforming businesses through innovative technology solutions"}}', 'Leading technology company specializing in web development, mobile apps, AI automation, and custom software solutions.', TRUE),
('about', 'About Limitless Infotech - Our Story & Mission', '{"mission": "To empower businesses with cutting-edge technology solutions that drive growth and innovation."}', 'Learn about Limitless Infotech''s mission to deliver exceptional technology solutions and transform businesses worldwide.', TRUE),
('services', 'Our Services - Comprehensive Technology Solutions', '{"overview": "Comprehensive technology services tailored to your needs"}', 'Explore our full range of technology services including web development, mobile apps, AI automation, and custom software.', TRUE),
('contact', 'Contact Us - Get In Touch With Our Experts', '{"info": "Get in touch with our expert team for your next technology project."}', 'Ready to start your technology project? Contact Limitless Infotech today for a free consultation.', TRUE);

-- Seed FAQs
INSERT INTO public.faqs (question, answer, category, tags, is_featured) VALUES
('What services do you offer?', 'We offer web development, mobile app development, custom software, AI automation, CRM systems, and logo design. Our comprehensive technology solutions are designed to meet diverse business needs.', 'services', '{"services", "overview"}', TRUE),
('How long does a typical project take?', 'Project timelines vary based on complexity, but most projects range from 4-12 weeks. We provide detailed timelines during our initial consultation and keep you updated throughout the development process.', 'general', '{"timeline", "process"}', TRUE),
('Do you provide ongoing support?', 'Yes, we offer post-launch maintenance and support packages to ensure your solution continues to perform optimally. Our support includes bug fixes, updates, and performance monitoring.', 'support', '{"maintenance", "support"}', TRUE),
('What is your development process?', 'Our process includes discovery, planning, design, development, testing, and deployment with regular client communication. We use agile methodologies to ensure transparency and collaboration.', 'process', '{"methodology", "agile"}', TRUE),
('Can you work with our existing systems?', 'Absolutely! We specialize in integrations and can work with your current tech stack. Our team has experience with various platforms and can ensure seamless integration.', 'integrations', '{"integration", "compatibility"}', TRUE),
('What technologies do you use?', 'We use modern, scalable technologies including React, Node.js, Python, AWS, Supabase, and more. We choose the best tools for each project based on specific requirements.', 'technology', '{"tech-stack", "tools"}', FALSE),
('Do you offer custom solutions?', 'Yes, we excel at creating custom solutions tailored to your unique business needs. Every project is approached with your specific goals and requirements in mind.', 'customization', '{"bespoke", "tailored"}', FALSE);

-- Seed Knowledge Base
INSERT INTO public.knowledge_base (title, content, category, tags) VALUES
('Company Overview', 'Limitless Infotech specializes in web development, mobile apps, custom software, CRM systems, and AI automation. Founded with a vision to bridge the gap between technology and business success.', 'company_info', '{"company", "overview", "mission"}'),
('Service Offerings', 'Our services include responsive web design, SEO optimization, mobile app development, custom software solutions, AI automation, and brand identity design.', 'services', '{"services", "offerings", "capabilities"}'),
('Industry Expertise', 'We have successfully delivered projects for education, finance, healthcare, and technology industries. Our cross-industry experience enables us to understand diverse business needs.', 'portfolio', '{"industries", "experience", "expertise"}'),
('Technology Stack', 'We leverage modern technologies including React, Node.js, Python, AWS, Supabase, and various AI/ML frameworks to build scalable, high-performance solutions.', 'technology', '{"tech-stack", "tools", "frameworks"}'),
('Development Process', 'Our agile development process ensures transparency, collaboration, and quality. We follow industry best practices with regular communication and iterative development.', 'process', '{"methodology", "agile", "best-practices"}');

-- =============================================================================
-- SETUP COMPLETE!
-- =============================================================================

/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                           🎉 SETUP COMPLETE!                               ║
║                                                                            ║
║  Your Supabase database is now fully configured with:                     ║
║  ✅ 16 tables with comprehensive relationships and constraints            ║
║  ✅ Advanced Row Level Security policies                                  ║
║  ✅ Performance indexes                                                   ║
║  ✅ Automated triggers and functions                                      ║
║  ✅ Analytics and notification systems                                    ║
║  ✅ File upload and email logging capabilities                            ║
║  ✅ Enhanced seed data with proper JSON formatting                        ║
║  ✅ Full-text search capabilities                                         ║
║                                                                            ║
║  Key Changes Made:                                                        ║
║  • Removed vector extension for better compatibility                      ║
║  • Fixed malformed JSON in seed data                                      ║
║  • Simplified setup for broader Supabase plan support                     ║
║                                                                            ║
║  Next steps:                                                              ║
║  1. Regenerate TypeScript types:                                          ║
║     npx supabase gen types typescript --project-id YOUR_PROJECT_ID         ║
║  2. Update your src/types/supabase.ts file                                ║
║  3. Test your application                                                 ║
║  4. Set up monitoring and backups                                         ║
║                                                                            ║
║  🚀 Ready to build amazing things!                                        ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/
