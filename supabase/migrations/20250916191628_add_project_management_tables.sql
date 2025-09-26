-- Add project management tables

-- Business projects table (separate from portfolio projects)
CREATE TABLE public.business_projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'in_progress', 'completed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    budget DECIMAL(10,2),
    client_name TEXT,
    client_email TEXT,
    project_type TEXT,
    tags TEXT[],
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Project activity logs
CREATE TABLE public.project_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.business_projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- 'created', 'updated', 'approved', 'rejected', 'assigned', etc.
    old_status TEXT,
    new_status TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'project_assigned', 'project_approved', 'email_received', etc.
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.business_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies for business_projects
CREATE POLICY "Admins can manage all projects" ON public.business_projects FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "Users can view projects assigned to them" ON public.business_projects FOR SELECT USING (
    assigned_to = auth.uid() OR owner_id = auth.uid() OR created_by = auth.uid()
);
CREATE POLICY "Users can update projects assigned to them" ON public.business_projects FOR UPDATE USING (
    assigned_to = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Policies for project_activities
CREATE POLICY "Admins and managers can view all activities" ON public.project_activities FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "Users can view activities for their projects" ON public.project_activities FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.business_projects WHERE id = project_id AND (assigned_to = auth.uid() OR owner_id = auth.uid() OR created_by = auth.uid()))
);
CREATE POLICY "System can insert activities" ON public.project_activities FOR INSERT WITH CHECK (true);

-- Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_business_projects_status ON public.business_projects(status);
CREATE INDEX idx_business_projects_assigned_to ON public.business_projects(assigned_to);
CREATE INDEX idx_business_projects_created_by ON public.business_projects(created_by);
CREATE INDEX idx_business_projects_owner_id ON public.business_projects(owner_id);
CREATE INDEX idx_business_projects_due_date ON public.business_projects(due_date);
CREATE INDEX idx_project_activities_project_id ON public.project_activities(project_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
