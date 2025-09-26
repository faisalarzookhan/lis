# Limitless Infotech Solution's

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.57.4-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC)](https://tailwindcss.com/)

A comprehensive business website for Limitless Infotech, featuring an admin panel, AI-powered chatbot, PWA capabilities, and advanced content management system.

## 🌟 Features

### Public Website
- **Modern Homepage**: Hero section, services overview, testimonials carousel, partners, FAQ
- **Company Pages**: About, Services, Portfolio, Contact, Testimonials
- **Contact Forms**: General inquiry and advanced client forms with email integration
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **SEO Optimized**: Meta tags, structured data, and performance optimizations

### Admin Panel
- **Content Management**: Dynamic page editing, services, projects, testimonials, team members
- **Lead Management**: Contact form submissions with intelligent scoring
- **User Management**: Role-based access control (admin, moderator, user)
- **Analytics Dashboard**: Comprehensive metrics and insights
- **File Upload System**: Secure document and image management

### AI Chatbot
- **Intelligent Conversations**: Context-aware responses using Google Generative AI
- **Knowledge Base**: Vector search for relevant company information
- **Session Management**: Conversation history and user context
- **Feedback System**: User satisfaction tracking and analytics
- **Multi-language Support**: Extensible for internationalization

### Advanced Features
- **Progressive Web App**: Offline capabilities and install prompts
- **Real-time Notifications**: User notification system
- **Email Integration**: Automated responses with Resend
- **Analytics Tracking**: Custom event logging and reporting
- **Security**: Row Level Security, rate limiting, input validation

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **React Hook Form + Zod** - Form handling and validation

### Backend & Database
- **Supabase** - Backend-as-a-Service (PostgreSQL, Auth, Storage)
- **Row Level Security** - Database-level access control
- **Real-time Subscriptions** - Live data updates
- **Vector Search** - AI-powered content search

### Integrations
- **Google Generative AI** - Chatbot intelligence
- **Resend** - Email delivery service
- **Supabase Storage** - File uploads
- **Analytics** - Custom event tracking

### Development Tools
- **ESLint** - Code linting
- **Jest** - Testing framework
- **PostCSS** - CSS processing
- **TypeScript** - Type checking

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd limitless-infotech-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env.local` in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_DATABASE_URL=your-supabase-database-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

   # AI Integration
   GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-api-key

   # Email Service
   RESEND_API_KEY=your-resend-api-key

   # Optional: Analytics
   NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
   ```

4. **Database Setup**
   - Create a new Supabase project
   - Run the database setup script:
     ```bash
     # Copy the contents of complete_supabase_setup_enhanced.sql
     # Paste into Supabase SQL Editor and execute
     ```
   - Generate TypeScript types:
     ```bash
     npx supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > src/types/supabase.ts
     ```

5. **Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin panel pages
│   ├── api/                      # API routes
│   ├── contact/                  # Contact page
│   └── ...
├── src/
│   ├── components/               # Reusable components
│   │   ├── admin/               # Admin components
│   │   ├── chatbot/             # Chatbot components
│   │   ├── contact/             # Contact forms
│   │   ├── home/                # Homepage sections
│   │   ├── ui/                  # UI components
│   │   └── ...
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities and configurations
│   ├── pages/                   # Page components
│   ├── types/                   # TypeScript definitions
│   └── ...
├── supabase/                    # Database migrations
├── public/                      # Static assets
├── tests/                       # Test files
└── ...
```

## 🗄️ Database Schema

The application uses 16 PostgreSQL tables with comprehensive relationships:

- **Content Tables**: services, team_members, testimonials, projects, pages, faqs
- **User Management**: profiles, leads, notifications
- **Chatbot**: chat_sessions, chat_messages, chat_feedback, knowledge_base
- **Analytics**: analytics_events, email_logs, file_uploads

All tables include Row Level Security policies and performance indexes.

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm test             # Run Jest tests
npm run test:watch   # Run tests in watch mode

# Database
npm run db:generate  # Generate TypeScript types
npm run db:reset     # Reset database (development only)
```

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables

### Manual Deployment
```bash
npm run build
npm run start
```

## 🔐 Security

- **Authentication**: Supabase Auth with secure session management
- **Authorization**: Role-based access control (user, admin, moderator)
- **Data Protection**: Row Level Security on all database operations
- **Input Validation**: Zod schemas for all user inputs
- **Rate Limiting**: API endpoint protection
- **HTTPS**: Enforced secure connections

## 📊 Analytics & Monitoring

- **Custom Analytics**: Event tracking for user behavior
- **Performance Monitoring**: Core Web Vitals tracking
- **Error Tracking**: Comprehensive error logging
- **Database Monitoring**: Query performance and usage stats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow conventional commit messages
- Ensure all tests pass

## 📝 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:
- Email: support@limitlessinfotech.com
- Documentation: [Internal Wiki]
- Issues: [GitHub Issues]

## 🙏 Acknowledgments

- **Supabase** for the excellent backend platform
- **Google AI** for the Generative AI capabilities
- **Next.js** for the powerful React framework
- **Tailwind CSS** for the utility-first styling approach

---

**Built with ❤️ by the Limitless Infotech Team**
