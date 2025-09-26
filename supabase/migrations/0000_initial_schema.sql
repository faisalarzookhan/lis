/*
# [Complete Consolidated Schema for Limitless Infotech]
This script creates a fully consolidated, consistent database schema for the Limitless Infotech website. It includes all tables for content management, admin panel, chatbot, and lead tracking with proper RLS policies, triggers, and initial data.

## Key Improvements & Fixes:
- Consistent UUID primary keys for all tables
- Standardized column naming (snake_case)
- Comprehensive RLS policies for security
- Proper foreign key relationships
- Indexes for performance
- Triggers for automatic profile creation
- Vector extension for AI features
- Consolidated initial data seeding

## Query Description:
This is a complete schema reset and rebuild. It drops all existing tables and recreates them with consistent structure. BACKUP YOUR DATA BEFORE RUNNING.

## Metadata:
- Schema-Category: "Complete Reset"
- Impact-Level: "High"
- Requires-Backup: true
- Reversible: false

## Structure Details:
- Drops all existing tables
- Creates 11 tables with consistent structure
- Enables RLS on all tables
- Creates comprehensive policies
- Adds triggers and indexes
- Seeds initial data

## Security Implications:
- RLS enabled on all tables
- Role-based access control
- Secure chatbot data handling
- Public read access for content tables

## Performance Impact:
- Optimized indexes on foreign keys and searchable columns
- Efficient RLS policies
- Vector embeddings for AI search
*/

-- Step 1: Drop all existing tables to ensure clean slate
DROP TABLE IF EXISTS public.knowledge_base CASCADE;
DROP TABLE IF EXISTS public.chat_feedback CASCADE;
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_sessions CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.pages CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;

-- Step 2: Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;

-- Step 3: Create Core Content Tables

CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    features JSONB NOT NULL,
    benefits TEXT NOT NULL,
    link TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT NOT NULL,
    image TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    image TEXT,
    approved BOOLEAN DEFAULT FALSE NOT NULL,
    page_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    industry TEXT NOT NULL,
    service_type TEXT NOT NULL,
    project_size TEXT NOT NULL,
    image TEXT NOT NULL,
    challenge TEXT NOT NULL,
    solution TEXT NOT NULL,
    tech_stack JSONB NOT NULL,
    results JSONB NOT NULL,
    client_review JSONB,
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    version INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Step 4: Create Admin Panel Tables

CREATE TABLE public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_name TEXT NOT NULL UNIQUE,
    content JSONB,
    version INTEGER DEFAULT 1 NOT NULL,
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_basics JSONB,
    project_details JSONB,
    timeline_budget JSONB,
    source_page TEXT,
    lead_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'user' NOT NULL,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Step 5: Create Chatbot Tables

CREATE TABLE public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'bot')),
    content TEXT NOT NULL,
    structured_data JSONB,
    suggestions TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.chat_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    rating TEXT NOT NULL CHECK (rating IN ('positive', 'negative')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    embedding VECTOR(1536),
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Step 6: Create Indexes for Performance

CREATE INDEX idx_projects_is_published ON public.projects(is_published);
CREATE INDEX idx_testimonials_approved ON public.testimonials(approved);
CREATE INDEX idx_pages_is_published ON public.pages(is_published);
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_feedback_message_id ON public.chat_feedback(message_id);
CREATE INDEX idx_knowledge_base_category ON public.knowledge_base(category);

-- Step 7: Enable Row Level Security

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

-- Step 8: Create RLS Policies

-- Public read access for content tables
CREATE POLICY "services_public_read" ON public.services FOR SELECT USING (true);
CREATE POLICY "team_members_public_read" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "testimonials_public_read" ON public.testimonials FOR SELECT USING (approved = true);
CREATE POLICY "projects_public_read" ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "pages_public_read" ON public.pages FOR SELECT USING (is_published = true);

-- Anonymous insert for forms
CREATE POLICY "testimonials_anon_insert" ON public.testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "leads_anon_insert" ON public.leads FOR INSERT WITH CHECK (true);

-- Authenticated user policies
CREATE POLICY "profiles_user_read" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_user_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Chat policies for users
CREATE POLICY "chat_sessions_user_all" ON public.chat_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "chat_messages_user_all" ON public.chat_messages FOR ALL
  USING (
    (SELECT user_id FROM public.chat_sessions WHERE id = session_id) = auth.uid()
  );
CREATE POLICY "chat_feedback_user_all" ON public.chat_feedback FOR ALL
  USING (
    (SELECT user_id FROM public.chat_sessions WHERE id = session_id) = auth.uid()
  );

-- Admin policies (for future admin role implementation)
CREATE POLICY "services_admin_all" ON public.services FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "projects_admin_all" ON public.projects FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "pages_admin_all" ON public.pages FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "leads_admin_read" ON public.leads FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "testimonials_admin_all" ON public.testimonials FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "team_members_admin_all" ON public.team_members FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Step 9: Create Triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to relevant tables
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON public.knowledge_base
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Step 10: Grant Permissions

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Step 11: Insert Initial Data

INSERT INTO public.services (title, description, icon, features, benefits, link) VALUES
('Web Development', 'Responsive, high-performing websites that align with your brand identity. Optimized for speed, functionality, and SEO.', 'MonitorSmartphone', '["Responsive design", "SEO optimization", "Speed optimization", "Brand consistency"]', 'Boost online visibility, reduce bounce rates, and build a foundation for scalable growth.', '#'),
('Mobile App Development', 'Native (iOS/Android) and hybrid apps with intuitive UI/UX. Built for performance, security, and cross-platform compatibility.', 'Smartphone', '["Native/hybrid development", "UI/UX optimization", "App Store compliance", "Post-launch maintenance"]', 'Expand your reach, enhance customer engagement, and drive revenue through mobile-first strategies.', '#'),
('Custom Software & Systems', 'Tailor-made internal systems to digitize operations, eliminate bottlenecks, and supercharge productivity.', 'Code', '["Workflow automation", "Scalable architecture", "Custom integrations (ERP, CRM)"]', 'Streamline operations, reduce manual effort, and gain full control over your systems.', '#'),
('CRM & Task Management', 'Intelligent CRM and task tracking platforms that give you complete visibility into team performance and customer interactions.', 'Users', '["Real-time task alerts", "Performance analytics", "Multi-user access control"]', 'Track leads, manage teams, and grow relationships—all in one intuitive platform.', '#'),
('Business Automation & AI', 'Leverage AI, APIs, and automation tools to simplify complex operations, reduce human error, and unlock data-driven decisions.', 'BrainCircuit', '["AI-driven predictive analytics", "API integrations", "IoT device management"]', 'Cut costs, boost accuracy, and future-proof your business with intelligent automation.', '#');

INSERT INTO public.team_members (name, role, bio, image) VALUES
('Faisal Khan', 'Founder & CEO', 'Visionary with 15+ years in tech, bridging the gap between innovation and practical business outcomes.', 'https://i.pravatar.cc/150?u=faisal'),
('Jane Doe', 'Head of Development', '10+ years in full-stack development; specializes in scalable cloud architectures.', 'https://i.pravatar.cc/150?u=jane'),
('John Smith', 'Lead UX Designer', 'Passionate about creating intuitive, user-centric designs that drive engagement.', 'https://i.pravatar.cc/150?u=john'),
('Emily White', 'AI & Automation Specialist', 'Expert in machine learning models and process automation for enterprise solutions.', 'https://i.pravatar.cc/150?u=emily');

INSERT INTO public.testimonials (name, role, company, content, rating, image, approved) VALUES
('A. Verma', 'CFO', 'FintechPro', 'Outstanding solutions, exceeded all metrics. Limitless delivered a secure, scalable platform that transformed our operations.', 5, 'https://i.pravatar.cc/150?u=verma', TRUE),
('R. Singh', 'Operations Lead', 'MediCare Inc.', 'Supportive, modern, and efficient team. Their custom software reduced our workflow bottlenecks by 40%.', 5, 'https://i.pravatar.cc/150?u=singh', TRUE),
('K. Mehra', 'CEO', 'TechPivot', 'Limitless helped us scale reliably. Their AI integration cut our manual tasks by 50%—game-changing.', 5, 'https://i.pravatar.cc/150?u=mehra', TRUE);

INSERT INTO public.projects (title, description, industry, service_type, project_size, image, challenge, solution, tech_stack, results, is_published) VALUES
('EduWorks LMS', 'Custom Learning Management System for 50K+ learners, built with scalability and compliance.', 'Education', 'Custom Software', 'Enterprise', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', 'EduWorks struggled with a legacy LMS—slow load times, limited user tracking, and compliance gaps.', 'We developed a cloud-based LMS with AI-driven analytics, role-based access, and GDPR/HIPAA compliance.', '["React", "Node.js", "AWS", "PostgreSQL"]', '["Reduced load time by 60%", "Increased user engagement by 45%", "Achieved 100% compliance"]', TRUE),
('FintechPro Mobile App', 'A secure mobile banking app with biometric login and real-time transaction alerts.', 'Finance', 'Mobile App Development', 'Growth', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80', 'Needed a highly secure, user-friendly mobile app to compete with larger banks.', 'Built a native iOS/Android app with multi-layer security, intuitive UI, and seamless API integrations.', '["SwiftUI", "Kotlin", "Supabase", "Stripe"]', '["20% increase in mobile users", "99.9% uptime", "5-star App Store rating"]', TRUE);

-- Insert sample pages
INSERT INTO public.pages (page_name, content, is_published) VALUES
('home', '{"hero": {"title": "Welcome to Limitless Infotech", "subtitle": "Transforming businesses through innovative technology solutions"}}', TRUE),
('about', '{"mission": "To empower businesses with cutting-edge technology solutions"}', TRUE);

-- Insert sample knowledge base entries
INSERT INTO public.knowledge_base (content, category) VALUES
('Limitless Infotech specializes in web development, mobile apps, custom software, CRM systems, and AI automation.', 'company_info'),
('Our services include responsive web design, SEO optimization, and brand consistency.', 'services'),
('We have successfully delivered projects for education, finance, healthcare, and technology industries.', 'portfolio');
