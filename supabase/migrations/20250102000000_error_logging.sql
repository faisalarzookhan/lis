-- Migration: Add comprehensive error logging
-- Description: Creates error_logs table to track application errors for debugging and monitoring
-- Priority: High (Database & API)

-- Create error logs table
CREATE TABLE public.error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_type TEXT NOT NULL, -- e.g., 'database', 'api', 'frontend', 'external_service'
    error_code TEXT,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    page_url TEXT,
    user_agent TEXT,
    ip_address INET,
    request_data JSONB, -- Request payload/context
    response_data JSONB, -- Response data if applicable
    severity TEXT DEFAULT 'error' CHECK (severity IN ('debug', 'info', 'warning', 'error', 'critical')),
    resolved BOOLEAN DEFAULT FALSE NOT NULL,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_error_logs_error_type ON public.error_logs(error_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_error_logs_severity ON public.error_logs(severity);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_error_logs_user_id ON public.error_logs(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_error_logs_created_at ON public.error_logs(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_error_logs_resolved ON public.error_logs(resolved) WHERE resolved = false;

-- Full-text search index
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_error_logs_fts ON public.error_logs USING gin(to_tsvector('english', error_message || ' ' || stack_trace));

-- Enable RLS
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view error logs
CREATE POLICY "error_logs_admin_read" ON public.error_logs FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin')
);

-- Allow authenticated users to insert errors (for client-side error reporting)
CREATE POLICY "error_logs_authenticated_insert" ON public.error_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Function to log errors
CREATE OR REPLACE FUNCTION public.log_error(
    p_error_type TEXT,
    p_error_message TEXT,
    p_error_code TEXT DEFAULT NULL,
    p_stack_trace TEXT DEFAULT NULL,
    p_request_data JSONB DEFAULT NULL,
    p_severity TEXT DEFAULT 'error'
)
RETURNS UUID AS $$
DECLARE
    error_id UUID;
BEGIN
    INSERT INTO public.error_logs (
        error_type, error_code, error_message, stack_trace, user_id,
        session_id, page_url, user_agent, ip_address, request_data, severity
    ) VALUES (
        p_error_type, p_error_code, p_error_message, p_stack_trace, auth.uid(),
        current_setting('request.jwt.claims', true)::json->>'session_id',
        current_setting('request.headers', true)::json->>'referer',
        current_setting('request.headers', true)::json->>'user-agent',
        inet_client_addr(), p_request_data, p_severity
    )
    RETURNING id INTO error_id;

    RETURN error_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark error as resolved
CREATE OR REPLACE FUNCTION public.resolve_error(
    p_error_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.error_logs
    SET resolved = TRUE,
        resolved_at = NOW(),
        resolved_by = auth.uid()
    WHERE id = p_error_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.log_error TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.resolve_error TO authenticated;
