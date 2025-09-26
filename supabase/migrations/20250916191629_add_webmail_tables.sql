-- Add webmail tables

-- Email accounts/settings for users
CREATE TABLE public.email_accounts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email_address TEXT NOT NULL,
    display_name TEXT,
    imap_host TEXT,
    imap_port INTEGER DEFAULT 993,
    smtp_host TEXT,
    smtp_port INTEGER DEFAULT 587,
    username TEXT,
    password_encrypted TEXT, -- Encrypted password
    use_ssl BOOLEAN DEFAULT true,
    use_tls BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, email_address)
);

-- Email threads
CREATE TABLE public.email_threads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    subject TEXT NOT NULL,
    participants TEXT[] NOT NULL,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    message_count INTEGER DEFAULT 1,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Emails table
CREATE TABLE public.emails (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    thread_id UUID REFERENCES public.email_threads(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.email_accounts(id) ON DELETE CASCADE,
    message_id TEXT UNIQUE, -- IMAP message ID
    from_address TEXT NOT NULL,
    to_addresses TEXT[] NOT NULL,
    cc_addresses TEXT[] DEFAULT '{}',
    bcc_addresses TEXT[] DEFAULT '{}',
    subject TEXT NOT NULL,
    body_text TEXT,
    body_html TEXT,
    attachments JSONB DEFAULT '[]',
    is_read BOOLEAN DEFAULT false,
    is_starred BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    is_draft BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Email labels/tags
CREATE TABLE public.email_labels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    account_id UUID REFERENCES public.email_accounts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(account_id, name)
);

-- Email to label relationship
CREATE TABLE public.email_label_assignments (
    email_id UUID REFERENCES public.emails(id) ON DELETE CASCADE,
    label_id UUID REFERENCES public.email_labels(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (email_id, label_id)
);

-- Enable Row Level Security
ALTER TABLE public.email_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_label_assignments ENABLE ROW LEVEL SECURITY;

-- Policies for email_accounts
CREATE POLICY "Users can manage their own email accounts" ON public.email_accounts FOR ALL USING (user_id = auth.uid());

-- Policies for email_threads
CREATE POLICY "Users can view threads from their accounts" ON public.email_threads FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.emails e JOIN public.email_accounts ea ON e.account_id = ea.id WHERE e.thread_id = email_threads.id AND ea.user_id = auth.uid())
);

-- Policies for emails
CREATE POLICY "Users can view emails from their accounts" ON public.emails FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.email_accounts WHERE id = account_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage emails from their accounts" ON public.emails FOR ALL USING (
    EXISTS (SELECT 1 FROM public.email_accounts WHERE id = account_id AND user_id = auth.uid())
);

-- Policies for email_labels
CREATE POLICY "Users can manage labels for their accounts" ON public.email_labels FOR ALL USING (
    EXISTS (SELECT 1 FROM public.email_accounts WHERE id = account_id AND user_id = auth.uid())
);

-- Policies for email_label_assignments
CREATE POLICY "Users can manage label assignments for their emails" ON public.email_label_assignments FOR ALL USING (
    EXISTS (SELECT 1 FROM public.emails e JOIN public.email_accounts ea ON e.account_id = ea.id WHERE e.id = email_id AND ea.user_id = auth.uid())
);

-- Create indexes
CREATE INDEX idx_email_accounts_user_id ON public.email_accounts(user_id);
CREATE INDEX idx_email_threads_participants ON public.email_threads USING GIN(participants);
CREATE INDEX idx_email_threads_last_message_at ON public.email_threads(last_message_at);
CREATE INDEX idx_emails_thread_id ON public.emails(thread_id);
CREATE INDEX idx_emails_account_id ON public.emails(account_id);
CREATE INDEX idx_emails_received_at ON public.emails(received_at);
CREATE INDEX idx_emails_is_read ON public.emails(is_read);
CREATE INDEX idx_emails_is_deleted ON public.emails(is_deleted);
CREATE INDEX idx_email_labels_account_id ON public.email_labels(account_id);
CREATE INDEX idx_email_label_assignments_email_id ON public.email_label_assignments(email_id);
CREATE INDEX idx_email_label_assignments_label_id ON public.email_label_assignments(label_id);

-- Function to update thread metadata when email is added
CREATE OR REPLACE FUNCTION update_email_thread_metadata()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.email_threads
  SET
    last_message_at = NEW.received_at,
    message_count = message_count + 1,
    is_read = CASE WHEN NEW.is_read THEN is_read ELSE false END,
    updated_at = NOW()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update thread metadata
CREATE TRIGGER trigger_update_email_thread_metadata
  AFTER INSERT ON public.emails
  FOR EACH ROW EXECUTE FUNCTION update_email_thread_metadata();

-- Function to create or find thread
CREATE OR REPLACE FUNCTION get_or_create_email_thread(
  p_subject TEXT,
  p_participants TEXT[],
  p_received_at TIMESTAMP WITH TIME ZONE
) RETURNS UUID AS $$
DECLARE
  thread_id UUID;
BEGIN
  -- Try to find existing thread with same subject and overlapping participants
  SELECT id INTO thread_id
  FROM public.email_threads
  WHERE subject = p_subject
    AND participants && p_participants
  ORDER BY last_message_at DESC
  LIMIT 1;

  IF thread_id IS NULL THEN
    INSERT INTO public.email_threads (subject, participants, last_message_at)
    VALUES (p_subject, p_participants, p_received_at)
    RETURNING id INTO thread_id;
  END IF;

  RETURN thread_id;
END;
$$ LANGUAGE plpgsql;
