# Development Setup Guide

This guide will help you set up the Limitless Infotech website project for local development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- **Git** - [Download from git-scm.com](https://git-scm.com/)
- **Supabase CLI** - Install with `npm install -g supabase`
- **VS Code** (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd limitless-infotech-solution-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in the required values (see Environment Variables section below).

4. **Set up Supabase**
   ```bash
   # Initialize Supabase (if not already done)
   supabase init

   # Start local Supabase services
   supabase start

   # Run database migrations
   supabase db reset
   ```

5. **Generate TypeScript types**
   ```bash
   npm run db:generate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google AI (Gemini) Configuration
GOOGLE_AI_API_KEY=your-google-ai-api-key

# Email Service (Resend)
RESEND_API_KEY=your-resend-api-key

# Analytics (Optional)
GOOGLE_ANALYTICS_ID=your-ga-id

# Admin Configuration
ADMIN_EMAIL=admin@limitlessinfotech.com
```

### Getting Supabase Keys

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to Settings > API
3. Copy the Project URL and anon/public key
4. For the service role key, go to Settings > API > Service Role Key

### Getting Google AI API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your environment variables

### Getting Resend API Key

1. Go to [resend.com](https://resend.com) and create an account
2. Go to API Keys and create a new key
3. Copy the key to your environment variables

## Database Setup

### Local Development

```bash
# Start Supabase locally
supabase start

# Reset database and run migrations
supabase db reset

# Generate TypeScript types
npm run db:generate
```

### Production Database

The production database is hosted on Supabase. Migrations are automatically applied when deploying.

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode

# Database
npm run db:generate  # Generate TypeScript types from Supabase
npm run db:reset     # Reset local database (development only)

# Knowledge Base
npm run kb:generate  # Generate knowledge base embeddings
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin panel pages
│   └── (public)/          # Public pages
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── admin/        # Admin-specific components
│   │   ├── chatbot/      # Chatbot components
│   │   └── common/       # Shared components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   └── types/            # TypeScript type definitions
├── supabase/
│   ├── migrations/       # Database migrations
│   └── functions/        # Edge functions
├── public/               # Static assets
└── scripts/              # Build and utility scripts
```

## Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow TypeScript best practices
   - Write tests for new features
   - Update documentation as needed

3. **Run tests and linting**
   ```bash
   npm run lint
   npm run test
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

- Use TypeScript for all new code
- Follow the existing naming conventions
- Use Tailwind CSS for styling
- Write descriptive commit messages
- Add JSDoc comments for complex functions

### Testing

- Write unit tests for utilities and hooks
- Write integration tests for API routes
- Write component tests for complex UI components
- Aim for 80%+ test coverage

## Admin Panel Access

To access the admin panel:

1. Go to `/admin/login`
2. Use the admin credentials set in your environment
3. Or create a user account and update the role in Supabase

## Troubleshooting

### Common Issues

**Port 3000 already in use**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
# Or use a different port
npm run dev -- -p 3001
```

**Supabase connection issues**
```bash
# Check if Supabase is running
supabase status

# Restart Supabase
supabase stop
supabase start
```

**TypeScript errors**
```bash
# Regenerate types
npm run db:generate

# Clear Next.js cache
rm -rf .next
```

**Test failures**
```bash
# Clear Jest cache
npx jest --clearCache

# Run tests with verbose output
npm run test -- --verbose
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm run start
```

## Contributing

1. Follow the development workflow above
2. Ensure all tests pass
3. Update documentation for any new features
4. Follow conventional commit messages

## Support

For development support:
- Check the README.md for project overview
- Review the TODO.md for planned features
- Check existing issues and pull requests
- Contact the development team

---

Happy coding! 🚀
