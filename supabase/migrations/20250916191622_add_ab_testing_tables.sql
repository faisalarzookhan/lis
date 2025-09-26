-- Add A/B testing tables
CREATE TABLE public.ab_tests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'paused')),
    test_type TEXT NOT NULL CHECK (test_type IN ('page', 'component', 'content')),
    target_url TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE public.ab_variants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    test_id UUID NOT NULL REFERENCES public.ab_tests(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    content JSONB NOT NULL,
    traffic_percentage INTEGER DEFAULT 50 CHECK (traffic_percentage >= 0 AND traffic_percentage <= 100),
    is_control BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE public.ab_conversions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    test_id UUID NOT NULL REFERENCES public.ab_tests(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES public.ab_variants(id) ON DELETE CASCADE,
    user_id UUID,
    session_id TEXT,
    conversion_type TEXT NOT NULL,
    conversion_value DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_conversions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage A/B tests" ON public.ab_tests FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage A/B variants" ON public.ab_variants FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can view conversions" ON public.ab_conversions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System can insert conversions" ON public.ab_conversions FOR INSERT WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_ab_tests_status ON public.ab_tests(status);
CREATE INDEX idx_ab_variants_test_id ON public.ab_variants(test_id);
CREATE INDEX idx_ab_conversions_test_id ON public.ab_conversions(test_id);
CREATE INDEX idx_ab_conversions_variant_id ON public.ab_conversions(variant_id);
CREATE INDEX idx_ab_conversions_session_id ON public.ab_conversions(session_id);
