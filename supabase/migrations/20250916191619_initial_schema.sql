-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- Create custom types if needed
-- (none for now)

-- Create tables

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Services table
CREATE TABLE public.services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    benefits TEXT NOT NULL,
    features JSONB NOT NULL,
    icon TEXT NOT NULL,
    link TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Team members table
CREATE TABLE public.team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT NOT NULL,
    image TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Projects table (portfolio)
CREATE TABLE public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    challenge TEXT NOT NULL,
    solution TEXT NOT NULL,
    results JSONB NOT NULL,
    tech_stack JSONB NOT NULL,
    industry TEXT NOT NULL,
    service_type TEXT NOT NULL,
    project_size TEXT NOT NULL,
    image TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Testimonials table
CREATE TABLE public.testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    image TEXT,
    approved BOOLEAN DEFAULT false,
    page_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Pages table (for CMS)
CREATE TABLE public.pages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    page_name TEXT NOT NULL UNIQUE,
    content JSONB,
    is_published BOOLEAN DEFAULT false,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Leads table
CREATE TABLE public.leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_basics JSONB,
    project_details JSONB,
    timeline_budget JSONB,
    source_page TEXT,
    lead_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Knowledge base table
CREATE TABLE public.knowledge_base (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    category TEXT,
    embedding VECTOR(1536), -- Assuming OpenAI embeddings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Chat sessions table
CREATE TABLE public.chat_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Chat messages table
CREATE TABLE public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    sender TEXT NOT NULL, -- 'user' or 'bot'
    content TEXT NOT NULL,
    structured_data JSONB,
    suggestions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Chat feedback table
CREATE TABLE public.chat_feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
    rating TEXT NOT NULL, -- 'positive', 'negative', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add foreign key for testimonials to pages
ALTER TABLE public.testimonials ADD CONSTRAINT testimonials_page_id_fkey FOREIGN KEY (page_id) REFERENCES public.pages(id);

-- Create indexes
CREATE INDEX idx_knowledge_base_embedding ON public.knowledge_base USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_feedback_session_id ON public.chat_feedback(session_id);
CREATE INDEX idx_chat_feedback_message_id ON public.chat_feedback(message_id);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
CREATE INDEX idx_testimonials_approved ON public.testimonials(approved);
CREATE INDEX idx_pages_page_name ON public.pages(page_name);
CREATE INDEX idx_projects_is_published ON public.projects(is_published);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Profiles: Users can read/update their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Services: Public read, admin write
CREATE POLICY "Public can view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Team members: Public read, admin write
CREATE POLICY "Public can view team members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Admins can manage team members" ON public.team_members FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Projects: Public read published, admin all
CREATE POLICY "Public can view published projects" ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage projects" ON public.projects FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Testimonials: Public read approved, admin all
CREATE POLICY "Public can view approved testimonials" ON public.testimonials FOR SELECT USING (approved = true);
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Pages: Public read published, admin all
CREATE POLICY "Public can view published pages" ON public.pages FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage pages" ON public.pages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Leads: Admin read/write, authenticated users can insert
CREATE POLICY "Authenticated users can create leads" ON public.leads FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can view leads" ON public.leads FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update leads" ON public.leads FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Knowledge base: Admin manage, perhaps public read for chatbot
CREATE POLICY "Public can view knowledge base" ON public.knowledge_base FOR SELECT USING (true);
CREATE POLICY "Admins can manage knowledge base" ON public.knowledge_base FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Chat sessions: Users can manage their own, admins all
CREATE POLICY "Users can view own chat sessions" ON public.chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create chat sessions" ON public.chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Users can update own chat sessions" ON public.chat_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all chat sessions" ON public.chat_sessions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Chat messages: Users can view messages from their sessions, admins all
CREATE POLICY "Users can view messages from own sessions" ON public.chat_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.chat_sessions WHERE id = session_id AND (user_id = auth.uid() OR user_id IS NULL))
);
CREATE POLICY "Users can create messages in own sessions" ON public.chat_messages FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.chat_sessions WHERE id = session_id AND (user_id = auth.uid() OR user_id IS NULL))
);
CREATE POLICY "Admins can manage all messages" ON public.chat_messages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Chat feedback: Users can create feedback for their messages, admins all
CREATE POLICY "Users can create feedback for own messages" ON public.chat_feedback FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.chat_messages cm JOIN public.chat_sessions cs ON cm.session_id = cs.id WHERE cm.id = message_id AND (cs.user_id = auth.uid() OR cs.user_id IS NULL))
);
CREATE POLICY "Admins can manage all feedback" ON public.chat_feedback FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create functions

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function for similarity search in knowledge base
CREATE OR REPLACE FUNCTION public.match_knowledge_base(query_embedding VECTOR(1536), match_threshold FLOAT DEFAULT 0.8, match_count INT DEFAULT 5)
RETURNS TABLE(id UUID, content TEXT, category TEXT, similarity FLOAT)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_base.id,
    knowledge_base.content,
    knowledge_base.category,
    1 - (knowledge_base.embedding <=> query_embedding) AS similarity
  FROM knowledge_base
  WHERE 1 - (knowledge_base.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_base.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Insert initial data

-- Services
INSERT INTO public.services (title, description, benefits, features, icon, link) VALUES
('Web Development', 'Custom web applications built with modern technologies', 'Scalable, secure, and user-friendly solutions', '["React", "Next.js", "Node.js", "Database Design"]', 'Code', '/services#web-development'),
('Mobile App Development', 'Native and cross-platform mobile applications', 'Engaging user experiences across all devices', '["React Native", "Flutter", "iOS", "Android"]', 'Smartphone', '/services#mobile-development'),
('AI & Machine Learning', 'Intelligent solutions powered by cutting-edge AI', 'Automation, insights, and competitive advantage', '["Chatbots", "Predictive Analytics", "Computer Vision", "NLP"]', 'Brain', '/services#ai-ml'),
('Cloud Solutions', 'Scalable cloud infrastructure and migration services', 'Cost-effective, secure, and flexible deployments', '["AWS", "Azure", "GCP", "DevOps"]', 'Cloud', '/services#cloud-solutions'),
('UI/UX Design', 'Intuitive and beautiful user interfaces', 'Improved user satisfaction and conversion rates', '["User Research", "Wireframing", "Prototyping", "Design Systems"]', 'Palette', '/services#ui-ux'),
('Consulting', 'Strategic technology consulting and advisory', 'Optimized processes and technology roadmaps', '["Architecture Review", "Technology Assessment", "Project Planning", "Team Training"]', 'Users', '/services#consulting');

-- Team members
INSERT INTO public.team_members (name, role, bio, image) VALUES
('Faisal Khan', 'Founder & CEO', 'The visionary architect behind Limitless Infotech, Faisal Khan is a tech innovator who transforms complex challenges into groundbreaking solutions. With a relentless drive for excellence and a deep understanding of emerging technologies, he leads the company in pushing the boundaries of what''s possible in software development.', '/images/team/faisal.jpg'),
('Taj Nadaf', 'Co-Founder', 'A strategic mastermind and technical virtuoso, Taj Nadaf brings unparalleled expertise in cutting-edge technologies and innovative problem-solving. As the co-founder of Limitless Infotech, he orchestrates the seamless fusion of creativity and technology to deliver extraordinary digital experiences.', '/images/team/taj.jpg');

-- Production ready - no sample data inserted
-- Projects, testimonials, and knowledge base will be added through the admin panel
