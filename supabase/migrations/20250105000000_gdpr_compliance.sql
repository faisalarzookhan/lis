-- Migration: Add GDPR compliance features
-- Description: Creates tables and functions for GDPR compliance (data retention, consent, data export/deletion)
-- Priority: High (Security & Compliance)

-- Create data consent table
CREATE TABLE public.data_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL, -- 'marketing', 'analytics', 'necessary', 'preferences'
    consented BOOLEAN NOT NULL DEFAULT TRUE,
    consent_text TEXT NOT NULL, -- The consent text shown to user
    consent_version TEXT NOT NULL, -- Version of consent text
    ip_address INET,
    user_agent TEXT,
    consented_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    withdrawn_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, consent_type, consent_version)
);

-- Create data retention policies table
CREATE TABLE public.data_retention_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    retention_days INTEGER NOT NULL, -- Days to retain data
    retention_reason TEXT, -- Legal basis for retention
    auto_delete BOOLEAN DEFAULT TRUE NOT NULL, -- Whether to auto-delete expired data
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create data deletion requests table
CREATE TABLE public.data_deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    request_type TEXT NOT NULL CHECK (request_type IN ('account_deletion', 'data_deletion', 'data_portability')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
    reason TEXT, -- User's reason for request
    requested_data JSONB DEFAULT '{}'::jsonb, -- What data they want deleted/exported
    processed_at TIMESTAMPTZ,
    processed_by UUID REFERENCES auth.users(id),
    completion_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create data export logs table
CREATE TABLE public.data_export_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    request_id UUID REFERENCES public.data_deletion_requests(id) ON DELETE SET NULL,
    export_format TEXT DEFAULT 'json' CHECK (export_format IN ('json', 'csv', 'xml')),
    exported_tables JSONB DEFAULT '[]'::jsonb, -- List of tables exported
    file_url TEXT, -- URL to download exported data
    expires_at TIMESTAMPTZ, -- When the export link expires
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create data processing activities table (for record of processing)
CREATE TABLE public.data_processing_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_type TEXT NOT NULL, -- 'collection', 'processing', 'storage', 'transfer'
    data_categories JSONB NOT NULL DEFAULT '[]'::jsonb, -- Types of data processed
    legal_basis TEXT NOT NULL, -- GDPR legal basis
    purpose TEXT NOT NULL, -- Purpose of processing
    data_recipients TEXT[], -- Who receives the data
    retention_period TEXT, -- How long data is kept
    security_measures TEXT, -- Security measures in place
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_data_consents_user_id ON public.data_consents(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_data_consents_type ON public.data_consents(consent_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_data_consents_consented ON public.data_consents(consented) WHERE consented = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_data_deletion_requests_user_id ON public.data_deletion_requests(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_data_deletion_requests_status ON public.data_deletion_requests(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_data_deletion_requests_created_at ON public.data_deletion_requests(created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_data_export_logs_user_id ON public.data_export_logs(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_data_export_logs_expires_at ON public.data_export_logs(expires_at) WHERE expires_at IS NOT NULL;

-- Enable RLS
ALTER TABLE public.data_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_retention_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_export_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_processing_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "data_consents_user_all" ON public.data_consents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "data_consents_admin_read" ON public.data_consents FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin')
);

CREATE POLICY "data_retention_policies_admin_all" ON public.data_retention_policies FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin')
);

CREATE POLICY "data_deletion_requests_user_read" ON public.data_deletion_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "data_deletion_requests_user_insert" ON public.data_deletion_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "data_deletion_requests_admin_all" ON public.data_deletion_requests FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin')
);

CREATE POLICY "data_export_logs_user_read" ON public.data_export_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "data_export_logs_admin_all" ON public.data_export_logs FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin')
);

CREATE POLICY "data_processing_activities_public_read" ON public.data_processing_activities FOR SELECT USING (is_active = true);
CREATE POLICY "data_processing_activities_admin_all" ON public.data_processing_activities FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin')
);

-- Functions for GDPR compliance
CREATE OR REPLACE FUNCTION public.request_data_deletion(
    p_request_type TEXT DEFAULT 'data_deletion',
    p_reason TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    request_id UUID;
BEGIN
    INSERT INTO public.data_deletion_requests (user_id, request_type, reason)
    VALUES (auth.uid(), p_request_type, p_reason)
    RETURNING id INTO request_id;

    -- Log the request
    PERFORM public.create_audit_log('CREATE', 'data_deletion_requests', request_id);

    RETURN request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.export_user_data(
    p_request_id UUID DEFAULT NULL
)
RETURNS TABLE(table_name TEXT, record_count INTEGER, data JSONB) AS $$
DECLARE
    user_uuid UUID := auth.uid();
    table_record RECORD;
BEGIN
    -- If no request_id provided, create one
    IF p_request_id IS NULL THEN
        INSERT INTO public.data_deletion_requests (user_id, request_type, status)
        VALUES (user_uuid, 'data_portability', 'completed')
        RETURNING id INTO p_request_id;
    END IF;

    -- Export from each user-related table
    FOR table_record IN
        SELECT
            'profiles' as table_name,
            jsonb_agg(to_jsonb(p)) as data,
            count(*) as record_count
        FROM public.profiles p WHERE p.id = user_uuid

        UNION ALL

        SELECT
            'leads' as table_name,
            jsonb_agg(to_jsonb(l)) as data,
            count(*) as record_count
        FROM public.leads l WHERE l.updated_by = user_uuid

        UNION ALL

        SELECT
            'chat_sessions' as table_name,
            jsonb_agg(to_jsonb(cs)) as data,
            count(*) as record_count
        FROM public.chat_sessions cs WHERE cs.user_id = user_uuid

        UNION ALL

        SELECT
            'notifications' as table_name,
            jsonb_agg(to_jsonb(n)) as data,
            count(*) as record_count
        FROM public.notifications n WHERE n.user_id = user_uuid

        UNION ALL

        SELECT
            'data_consents' as table_name,
            jsonb_agg(to_jsonb(dc)) as data,
            count(*) as record_count
        FROM public.data_consents dc WHERE dc.user_id = user_uuid
    LOOP
        table_name := table_record.table_name;
        record_count := table_record.record_count;
        data := table_record.data;
        RETURN NEXT;
    END LOOP;

    -- Log the export
    INSERT INTO public.data_export_logs (user_id, request_id, exported_tables)
    VALUES (user_uuid, p_request_id, jsonb_build_array('profiles', 'leads', 'chat_sessions', 'notifications', 'data_consents'));

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.anonymize_user_data(
    p_user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Update profiles
    UPDATE public.profiles
    SET
        full_name = 'Anonymous User',
        avatar_url = NULL,
        phone = NULL,
        company = NULL,
        job_title = NULL,
        bio = NULL,
        updated_at = NOW()
    WHERE id = p_user_id;

    -- Anonymize leads
    UPDATE public.leads
    SET
        business_basics = '{"anonymized": true}'::jsonb,
        project_details = '{"anonymized": true}'::jsonb,
        timeline_budget = '{"anonymized": true}'::jsonb,
        contact_info = '{"anonymized": true}'::jsonb,
        notes = 'Anonymized',
        updated_at = NOW()
    WHERE updated_by = p_user_id;

    -- Anonymize chat sessions
    UPDATE public.chat_sessions
    SET
        user_info = '{"anonymized": true}'::jsonb,
        updated_at = NOW()
    WHERE user_id = p_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default retention policies
INSERT INTO public.data_retention_policies (table_name, retention_days, retention_reason, auto_delete) VALUES
('analytics_events', 2555, 'Analytics and performance monitoring', true), -- 7 years
('email_logs', 2555, 'Communication records', true),
('audit_logs', 2555, 'Security and compliance audit trail', false), -- Keep indefinitely
('error_logs', 365, 'Debugging and system maintenance', true), -- 1 year
('notifications', 365, 'User communication history', true),
('chat_sessions', 730, 'Customer service records', true), -- 2 years
('chat_messages', 730, 'Customer service records', true),
('chat_feedback', 730, 'Customer service records', true),
('file_uploads', 2555, 'Business records retention', true);

-- Insert default data processing activities
INSERT INTO public.data_processing_activities (
    activity_type, data_categories, legal_basis, purpose,
    data_recipients, retention_period, security_measures
) VALUES
('collection', '["personal_data", "contact_info", "usage_data"]', 'consent', 'Website functionality and user experience',
 '["internal_team", "hosting_provider"]', 'As needed for service', 'Encryption, access controls, regular security audits'),

('processing', '["personal_data", "communication_data"]', 'legitimate_interest', 'Customer support and communication',
 '["internal_team", "email_provider"]', '2 years', 'Encrypted storage, access logging, data minimization'),

('storage', '["all_user_data"]', 'contract', 'Data backup and business continuity',
 '["hosting_provider", "backup_service"]', '7 years', 'End-to-end encryption, multi-region replication, access controls');

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.request_data_deletion TO authenticated;
GRANT EXECUTE ON FUNCTION public.export_user_data TO authenticated;
GRANT EXECUTE ON FUNCTION public.anonymize_user_data TO service_role;
