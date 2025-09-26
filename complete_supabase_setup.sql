/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                    COMPLETE SUPABASE SCHEMA SETUP                          ║
║                    Limitless Infotech Website                              ║
║                                                                            ║
║  This script creates the complete database schema for the Limitless       ║
║  Infotech website including:                                               ║
║  - Content management tables (services, projects, testimonials, etc.)     ║
║  - Admin panel tables (pages, leads, profiles)                             ║
║  - AI Chatbot tables (sessions, messages, feedback, knowledge base)       ║
║  - Row Level Security policies                                             ║
║  - Performance indexes                                                     ║
║  - Triggers and functions                                                  ║
║  - Initial seed data                                                       ║
║                                                                            ║
║  ⚠️  WARNING: This will DROP existing tables! Backup your data first!     ║
║                                                                            ║
║  To use: Copy entire script → Supabase SQL Editor → Run                    ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/

-- =============================================================================
-- STEP 1: CLEANUP - Drop all existing tables (DESTRUCTIVE OPERATION)
-- =============================================================================

DROP TABLE IF EXISTS public.faqs CASCADE;
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

-- =============================================================================
-- STEP 2: ENABLE EXTENSIONS
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS vector;

-- =============================================================================
-- STEP 3: CREATE TABLES
-- =============================================================================

-- Core Content Tables
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

-- Admin Panel Tables
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

CREATE TABLE public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT faqs_question_unique UNIQUE (question)
);

-- Chatbot Tables
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

-- =============================================================================
-- STEP 4: CREATE INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX idx_projects_is_published ON public.projects(is_published);
CREATE INDEX idx_projects_industry ON public.projects(industry);
CREATE INDEX idx_testimonials_approved ON public.testimonials(approved);
CREATE INDEX idx_pages_is_published ON public.pages(is_published);
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_feedback_message_id ON public.chat_feedback(message_id);
CREATE INDEX idx_knowledge_base_category ON public.knowledge_base(category);
CREATE INDEX idx_faqs_category ON public.faqs(category);
-- Vector index for similarity search
CREATE INDEX idx_knowledge_base_embedding ON public.knowledge_base USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- =============================================================================
-- STEP 5: ENABLE ROW LEVEL SECURITY
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

-- =============================================================================
-- STEP 6: CREATE RLS POLICIES
-- =============================================================================

-- Public read access for content tables
CREATE POLICY "services_public_read" ON public.services FOR SELECT USING (true);
CREATE POLICY "team_members_public_read" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "testimonials_public_read" ON public.testimonials FOR SELECT USING (approved = true);
CREATE POLICY "projects_public_read" ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "pages_public_read" ON public.pages FOR SELECT USING (is_published = true);
CREATE POLICY "faqs_public_read" ON public.faqs FOR SELECT USING (true);

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
CREATE POLICY "knowledge_base_admin_all" ON public.knowledge_base FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "chat_sessions_admin_all" ON public.chat_sessions FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "chat_messages_admin_all" ON public.chat_messages FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "chat_feedback_admin_all" ON public.chat_feedback FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

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
CREATE POLICY "faqs_admin_all" ON public.faqs FOR ALL USING (
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

-- Function for vector similarity search in knowledge base
CREATE OR REPLACE FUNCTION match_knowledge_base(query_embedding VECTOR(1536), match_threshold FLOAT DEFAULT 0.1, match_count INT DEFAULT 5)
RETURNS TABLE(id UUID, content TEXT, similarity FLOAT)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_base.id,
    knowledge_base.content,
    1 - (knowledge_base.embedding <=> query_embedding) AS similarity
  FROM knowledge_base
  WHERE 1 - (knowledge_base.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_base.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Apply update trigger to relevant tables
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

-- Trigger to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =============================================================================
-- STEP 8: GRANT PERMISSIONS
-- =============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- =============================================================================
-- STEP 9: INSERT INITIAL SEED DATA
-- =============================================================================

-- Seed Services
INSERT INTO public.services (title, description, icon, features, benefits, link) VALUES
('Web Development', 'Responsive, high-performing websites that align with your brand identity. Optimized for speed, functionality, and SEO.', 'MonitorSmartphone', '["Responsive design", "SEO optimization", "Speed optimization", "Brand consistency"]', 'Boost online visibility, reduce bounce rates, and build a foundation for scalable growth.', '#'),
('Mobile App Development', 'Native (iOS/Android) and hybrid apps with intuitive UI/UX. Built for performance, security, and cross-platform compatibility.', 'Smartphone', '["Native/hybrid development", "UI/UX optimization", "App Store compliance", "Post-launch maintenance"]', 'Expand your reach, enhance customer engagement, and drive revenue through mobile-first strategies.', '#'),
('Custom Software & Systems', 'Tailor-made internal systems to digitize operations, eliminate bottlenecks, and supercharge productivity.', 'Code', '["Workflow automation", "Scalable architecture", "Custom integrations (ERP, CRM)"]', 'Streamline operations, reduce manual effort, and gain full control over your systems.', '#'),
('Automation & AI Solutions', 'Automate repetitive tasks, leverage AI for data insights, and integrate APIs to create intelligent workflows.', 'Robot', '["AI-driven analytics", "API integrations", "IoT solutions"]', 'Cut costs, boost accuracy, and future-proof your business with intelligent automation.', '#'),
('CRM & Task Management', 'Intelligent CRM and task tracking platforms that give you complete visibility into team performance and customer interactions.', 'Users', '["Real-time task alerts", "Performance analytics", "Multi-user access control"]', 'Track leads, manage teams, and grow relationships—all in one intuitive platform.', '#'),
('Logo Design', 'Creative logo design services to establish a strong brand identity and make a lasting impression.', 'Brush', '["Custom logo design", "Brand identity development", "Versatile logo formats"]', 'Stand out from the competition and create a memorable brand image.', '#'),
('Business Automation & AI', 'Leverage AI, APIs, and automation tools to simplify complex operations, reduce human error, and unlock data-driven decisions.', 'BrainCircuit', '["AI-driven predictive analytics", "API integrations", "IoT device management"]', 'Cut costs, boost accuracy, and future-proof your business with intelligent automation.', '#');

-- Seed Team Members
INSERT INTO public.team_members (name, role, bio, image) VALUES
('Faisal Khan', 'Founder & CEO', 'Visionary with 15+ years in tech, bridging the gap between innovation and practical business outcomes.', 'https://i.pravatar.cc/150?u=faisal'),
('Taj Nadaf', 'CTO', 'Expert in software development, specializing in scalable cloud architectures.', 'https://i.pravatar.cc/150?u=taj'),

-- Seed Testimonials
INSERT INTO public.testimonials (name, role, company, content, rating, image, approved) VALUES
('A. Verma', 'CFO', 'FintechPro', 'Outstanding solutions, exceeded all metrics. Limitless delivered a secure, scalable platform that transformed our operations.', 5, 'https://i.pravatar.cc/150?u=verma', TRUE),
('R. Singh', 'Operations Lead', 'MediCare Inc.', 'Supportive, modern, and efficient team. Their custom software reduced our workflow bottlenecks by 40%.', 5, 'https://i.pravatar.cc/150?u=singh', TRUE),
('K. Mehra', 'CEO', 'TechPivot', 'Limitless helped us scale reliably. Their AI integration cut our manual tasks by 50%—game-changing.', 5, 'https://i.pravatar.cc/150?u=mehra', TRUE);

-- Seed Projects
INSERT INTO public.projects (title, description, industry, service_type, project_size, image, challenge, solution, tech_stack, results, is_published) VALUES
('EduWorks LMS', 'Custom Learning Management System for 50K+ learners, built with scalability and compliance.', 'Education', 'Custom Software', 'Enterprise', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', 'EduWorks struggled with a legacy LMS—slow load times, limited user tracking, and compliance gaps.', 'We developed a cloud-based LMS with AI-driven analytics, role-based access, and GDPR/HIPAA compliance.', '["React", "Node.js", "AWS", "PostgreSQL"]', '["Reduced load time by 60%", "Increased user engagement by 45%", "Achieved 100% compliance"]', TRUE),
('FintechPro Mobile App', 'A secure mobile banking app with biometric login and real-time transaction alerts.', 'Finance', 'Mobile App Development', 'Growth', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80', 'Needed a highly secure, user-friendly mobile app to compete with larger banks.', 'Built a native iOS/Android app with multi-layer security, intuitive UI, and seamless API integrations.', '["SwiftUI", "Kotlin", "Supabase", "Stripe"]', '["20% increase in mobile users", "99.9% uptime", "5-star App Store rating"]', TRUE);

-- Seed Pages
INSERT INTO public.pages (page_name, content, is_published) VALUES
('home', '{"hero": {"title": "Welcome to Limitless Infotech", "subtitle": "Transforming businesses through innovative technology solutions"}}', TRUE),
('about', '{"mission": "To empower businesses with cutting-edge technology solutions"}', TRUE),
('services', '{"overview": "Comprehensive technology services tailored to your needs"}', TRUE),
('contact', '{"info": "Get in touch with our expert team"}', TRUE);

-- Seed FAQs
INSERT INTO public.faqs (question, answer, category) VALUES
('What services do you offer?', 'We offer web development, mobile app development, custom software, AI automation, CRM systems, and logo design.', 'services'),
('How long does a typical project take?', 'Project timelines vary based on complexity, but most projects range from 4-12 weeks.', 'general'),
('Do you provide ongoing support?', 'Yes, we offer post-launch maintenance and support packages to ensure your solution continues to perform optimally.', 'support'),
('What is your development process?', 'Our process includes discovery, planning, design, development, testing, and deployment with regular client communication.', 'process'),
('Can you work with our existing systems?', 'Absolutely! We specialize in integrations and can work with your current tech stack.', 'integrations');

-- Seed Knowledge Base
INSERT INTO public.knowledge_base (content, category) VALUES
('Limitless Infotech specializes in web development, mobile apps, custom software, CRM systems, and AI automation.', 'company_info'),
('Our services include responsive web design, SEO optimization, and brand consistency.', 'services'),
('We have successfully delivered projects for education, finance, healthcare, and technology industries.', 'portfolio');

-- =============================================================================
-- SETUP COMPLETE!
-- =============================================================================

/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                           🎉 SETUP COMPLETE!                               ║
║                                                                            ║
║  Your Supabase database is now fully configured with:                     ║
║  ✅ 12 tables with proper relationships and constraints                   ║
║  ✅ Row Level Security policies for security                              ║
║  ✅ Performance indexes including vector search                           ║
║  ✅ Auto-update triggers                                                  ║
║  ✅ User profile creation trigger                                         ║
║  ✅ Vector similarity search function                                     ║
║  ✅ Initial seed data with expanded content                               ║
║  ✅ Vector support for AI features                                        ║
║                                                                            ║
║  Next steps:                                                              ║
║  1. Regenerate TypeScript types:                                          ║
║     npx supabase gen types typescript --project-id YOUR_PROJECT_ID         ║
║  2. Update your src/types/supabase.ts file                                ║
║  3. Test your application                                                 ║
║                                                                            ║
║  🚀 Ready to build amazing things!                                        ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/
