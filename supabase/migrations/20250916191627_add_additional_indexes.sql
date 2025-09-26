-- Add additional indexes for performance

-- Index for leads on lead_score
CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON public.leads(lead_score);

-- Index for testimonials on rating
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON public.testimonials(rating);

-- Index for faqs on sort_order (already exists, but ensure)
-- Already in add_faq: CREATE INDEX idx_faqs_sort_order ON public.faqs(sort_order);

-- Index for projects on title
CREATE INDEX IF NOT EXISTS idx_projects_title ON public.projects(title);

-- Index for services on title
CREATE INDEX IF NOT EXISTS idx_services_title ON public.services(title);

-- Index for team_members on name
CREATE INDEX IF NOT EXISTS idx_team_members_name ON public.team_members(name);

-- Index for conversations on session_id (already exists)
-- Already in add_conversation_memory: CREATE INDEX idx_conversations_session_id ON public.conversations(session_id);

-- Ensure all necessary indexes are present
