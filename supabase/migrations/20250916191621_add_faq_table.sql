-- Add faqs table
CREATE TABLE public.faqs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    is_published BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create policies for faqs
CREATE POLICY "Public can view published FAQs" ON public.faqs FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage FAQs" ON public.faqs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create index for FAQs
CREATE INDEX idx_faqs_category ON public.faqs(category);
CREATE INDEX idx_faqs_is_published ON public.faqs(is_published);
CREATE INDEX idx_faqs_sort_order ON public.faqs(sort_order);
