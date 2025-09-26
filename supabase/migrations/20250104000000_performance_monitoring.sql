-- Migration: Add performance monitoring
-- Description: Creates tables to track application performance metrics
-- Priority: Medium (Analytics & Monitoring)

-- Create performance metrics table
CREATE TABLE public.performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type TEXT NOT NULL, -- 'page_load', 'api_response', 'database_query', 'memory_usage', 'cpu_usage'
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(10,4) NOT NULL,
    unit TEXT, -- 'ms', 'bytes', 'percentage', 'count'
    tags JSONB DEFAULT '{}'::jsonb, -- Additional metadata
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    page_url TEXT,
    api_endpoint TEXT,
    query_sql TEXT, -- For database queries
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create API performance table
CREATE TABLE public.api_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH')),
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER NOT NULL,
    request_size_bytes INTEGER,
    response_size_bytes INTEGER,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    error_message TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create database query performance table
CREATE TABLE public.query_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_hash TEXT NOT NULL, -- Hash of the query for grouping
    query_sql TEXT NOT NULL,
    execution_time_ms INTEGER NOT NULL,
    rows_affected INTEGER,
    rows_returned INTEGER,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    connection_id TEXT,
    transaction_id TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create system health table
CREATE TABLE public.system_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type TEXT NOT NULL, -- 'cpu', 'memory', 'disk', 'network', 'database_connections'
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(10,4) NOT NULL,
    unit TEXT NOT NULL,
    server_id TEXT, -- For multi-server setups
    threshold_warning DECIMAL(10,4),
    threshold_critical DECIMAL(10,4),
    status TEXT DEFAULT 'healthy' CHECK (status IN ('healthy', 'warning', 'critical')),
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create performance alerts table
CREATE TABLE public.performance_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type TEXT NOT NULL, -- 'response_time', 'error_rate', 'resource_usage', 'availability'
    severity TEXT DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    metric_name TEXT,
    current_value DECIMAL(10,4),
    threshold_value DECIMAL(10,4),
    affected_service TEXT,
    resolved BOOLEAN DEFAULT FALSE NOT NULL,
    resolved_at TIMESTAMPTZ,
    acknowledged BOOLEAN DEFAULT FALSE NOT NULL,
    acknowledged_by UUID REFERENCES auth.users(id),
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_metrics_type ON public.performance_metrics(metric_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_metrics_timestamp ON public.performance_metrics(timestamp DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_metrics_user_id ON public.performance_metrics(user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_performance_endpoint ON public.api_performance(endpoint);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_performance_timestamp ON public.api_performance(timestamp DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_performance_status ON public.api_performance(status_code);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_query_performance_hash ON public.query_performance(query_hash);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_query_performance_timestamp ON public.query_performance(timestamp DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_system_health_type ON public.system_health(metric_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_system_health_timestamp ON public.system_health(timestamp DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_system_health_status ON public.system_health(status) WHERE status != 'healthy';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_alerts_type ON public.performance_alerts(alert_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_alerts_severity ON public.performance_alerts(severity);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_alerts_resolved ON public.performance_alerts(resolved) WHERE resolved = false;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_alerts_created_at ON public.performance_alerts(created_at DESC);

-- Enable RLS
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.query_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_alerts ENABLE ROW LEVEL SECURITY;

-- Admin read policies
CREATE POLICY "performance_metrics_admin_read" ON public.performance_metrics FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'moderator')
);
CREATE POLICY "api_performance_admin_read" ON public.api_performance FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'moderator')
);
CREATE POLICY "query_performance_admin_read" ON public.query_performance FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'moderator')
);
CREATE POLICY "system_health_admin_read" ON public.system_health FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'moderator')
);
CREATE POLICY "performance_alerts_admin_all" ON public.performance_alerts FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'moderator')
);

-- Allow inserts for monitoring (service role or authenticated)
CREATE POLICY "performance_metrics_service_insert" ON public.performance_metrics FOR INSERT WITH CHECK (auth.role() = 'service_role' OR auth.uid() IS NOT NULL);
CREATE POLICY "api_performance_service_insert" ON public.api_performance FOR INSERT WITH CHECK (auth.role() = 'service_role' OR auth.uid() IS NOT NULL);
CREATE POLICY "query_performance_service_insert" ON public.query_performance FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "system_health_service_insert" ON public.system_health FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "performance_alerts_service_insert" ON public.performance_alerts FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Functions for performance monitoring
CREATE OR REPLACE FUNCTION public.record_api_performance(
    p_endpoint TEXT,
    p_method TEXT,
    p_status_code INTEGER,
    p_response_time_ms INTEGER,
    p_request_size_bytes INTEGER DEFAULT NULL,
    p_response_size_bytes INTEGER DEFAULT NULL,
    p_error_message TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    perf_id UUID;
BEGIN
    INSERT INTO public.api_performance (
        endpoint, method, status_code, response_time_ms,
        request_size_bytes, response_size_bytes, user_id,
        ip_address, user_agent, error_message
    ) VALUES (
        p_endpoint, p_method, p_status_code, p_response_time_ms,
        p_request_size_bytes, p_response_size_bytes, auth.uid(),
        inet_client_addr(),
        current_setting('request.headers', true)::json->>'user-agent',
        p_error_message
    )
    RETURNING id INTO perf_id;

    -- Check for performance alerts
    IF p_response_time_ms > 5000 THEN -- 5 second threshold
        PERFORM public.create_performance_alert(
            'response_time',
            'warning',
            'Slow API Response',
            format('API endpoint %s %s took %s ms', p_method, p_endpoint, p_response_time_ms),
            'response_time_ms',
            p_response_time_ms,
            5000,
            p_endpoint
        );
    END IF;

    RETURN perf_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.create_performance_alert(
    p_alert_type TEXT,
    p_severity TEXT,
    p_title TEXT,
    p_description TEXT,
    p_metric_name TEXT DEFAULT NULL,
    p_current_value DECIMAL DEFAULT NULL,
    p_threshold_value DECIMAL DEFAULT NULL,
    p_affected_service TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    alert_id UUID;
BEGIN
    INSERT INTO public.performance_alerts (
        alert_type, severity, title, description,
        metric_name, current_value, threshold_value, affected_service
    ) VALUES (
        p_alert_type, p_severity, p_title, p_description,
        p_metric_name, p_current_value, p_threshold_value, p_affected_service
    )
    RETURNING id INTO alert_id;

    RETURN alert_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.record_api_performance TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_performance_alert TO authenticated, service_role;
