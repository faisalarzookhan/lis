-- =============================================================================
-- CREATE TABLES SQL FILE
-- Limitless Infotech Website Database Schema
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS vector;

-- =============================================================================
-- CORE CONTENT TABLES
-- =============================================================================

-- Services table
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

-- Team members table
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

-- Testimonials table
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

-- Projects table
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

-- =============================================================================
-- ADMIN PANEL TABLES
-- =============================================================================

-- Pages table
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

-- Leads table
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

-- Profiles table
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

-- FAQs table
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

-- =============================================================================
-- CHATBOT TABLES
-- =============================================================================

-- Chat sessions table
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

-- Chat messages table
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

-- Chat feedback table
CREATE TABLE public.chat_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    rating TEXT NOT NULL CHECK (rating IN ('positive', 'negative', 'neutral')),
    feedback_text TEXT,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Knowledge base table
CREATE TABLE public.knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL CHECK (char_length(title) >= 3),
    content TEXT NOT NULL CHECK (char_length(content) >= 10),
    embedding VECTOR(1536),
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

-- =============================================================================
-- ADDITIONAL FEATURE TABLES
-- =============================================================================

-- File uploads table
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

-- Email logs table
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

-- Notifications table
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

-- Analytics events table
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
-- INDEXES FOR PERFORMANCE
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
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_knowledge_base_embedding ON public.knowledge_base USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

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
-- ENABLE ROW LEVEL SECURITY
-- =============================================================================

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
-- BASIC RLS POLICIES
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

-- Admin policies (basic)
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
-- BASIC FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
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

-- =============================================================================
-- GRANT BASIC PERMISSIONS
-- =============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- =============================================================================
-- TABLES CREATION COMPLETE!
-- =============================================================================

/*
This SQL file creates all the necessary tables for the Limitless Infotech website.
Run this in your Supabase SQL Editor to set up the database schema.

Tables created:
- services (7 records)
- team_members (4 records)
- testimonials (3 records)
- projects (2 records)
- pages (4 records)
- leads (contact forms)
- profiles (user profiles)
- faqs (7 records)
- chat_sessions, chat_messages, chat_feedback (chatbot)
- knowledge_base (AI knowledge)
- file_uploads, email_logs, notifications, analytics_events (features)

Next steps:
1. Run this SQL file in Supabase
2. Add seed data if needed
3. Regenerate TypeScript types
4. Test the application
*/
