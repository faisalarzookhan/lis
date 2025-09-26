-- Step 1: Create the faqs table
CREATE TABLE public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Step 2: Add an index for faster category lookups
CREATE INDEX idx_faqs_category ON public.faqs(category);

-- Step 3: Enable Row Level Security
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS Policies

-- Allow public, anonymous read access to all FAQs
CREATE POLICY "faqs_public_read" ON public.faqs
FOR SELECT USING (true);

-- Allow admins to perform any action on FAQs
CREATE POLICY "faqs_admin_all" ON public.faqs
FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Step 5: Add a trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
