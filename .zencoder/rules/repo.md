# Repository Info

- Name: limitless_infotech_solution_website
- Framework: Next.js (App Router) + legacy Vite SPA
- Key directories:
  - /app: Next.js App Router routes
  - /src: Legacy Vite React app (to be consolidated)
  - /supabase: Database migrations and edge functions
  - /public: Static assets and PWA files
- Config:
  - next.config.mjs: Next.js configuration
  - vite.config.ts: Legacy Vite config
  - tailwind.config.js: Tailwind CSS config
- Goals:
  - Consolidate to a single Next.js app
  - Implement Limitless chatbot with RAG over Supabase
  - Improve performance, security, and UX