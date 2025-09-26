-- Seed Pages
INSERT INTO public.pages (page_name, title, content, meta_description, is_published) VALUES
('home', 'Limitless Infotech - Innovative Technology Solutions', '{"hero": {"title": "Welcome to Limitless Infotech", "subtitle": "Transforming businesses through innovative technology solutions"}}', 'Leading technology company specializing in web development, mobile apps, AI automation, and custom software solutions.', TRUE),
('about', 'About Limitless Infotech - Our Story & Mission', '{"mission": "To empower businesses with cutting-edge technology solutions that drive growth and innovation."}', 'Learn about Limitless Infotech''s mission to deliver exceptional technology solutions and transform businesses worldwide.', TRUE),
('services', 'Our Services - Comprehensive Technology Solutions', '{"overview": "Comprehensive technology services tailored to your needs"}', 'Explore our full range of technology services including web development, mobile apps, AI automation, and custom software.', TRUE),
('contact', 'Contact Us - Get In Touch With Our Experts', '{"info": "Get in touch with our expert team for your next technology project."}', 'Ready to start your technology project? Contact Limitless Infotech today for a free consultation.', TRUE);

-- Seed FAQs
INSERT INTO public.faqs (question, answer, category, tags, is_featured) VALUES
('What services do you offer?', 'We offer web development, mobile app development, custom software, AI automation, CRM systems, and logo design. Our comprehensive technology solutions are designed to meet diverse business needs.', 'services', '{"services", "overview"}', TRUE),
('How long does a typical project take?', 'Project timelines vary based on complexity, but most projects range from 4-12 weeks. We provide detailed timelines during our initial consultation and keep you updated throughout the development process.', 'general', '{"timeline", "process"}', TRUE),
('Do you provide ongoing support?', 'Yes, we offer post-launch maintenance and support packages to ensure your solution continues to perform optimally. Our support includes bug fixes, updates, and performance monitoring.', 'support', '{"maintenance", "support"}', TRUE),
('What is your development process?', 'Our process includes discovery, planning, design, development, testing, and deployment with regular client communication. We use agile methodologies to ensure transparency and collaboration.', 'process', '{"methodology", "agile"}', TRUE),
('Can you work with our existing systems?', 'Absolutely! We specialize in integrations and can work with your current tech stack. Our team has experience with various platforms and can ensure seamless integration.', 'integrations', '{"integration", "compatibility"}', TRUE),
('What technologies do you use?', 'We use modern, scalable technologies including React, Node.js, Python, AWS, Supabase, and more. We choose the best tools for each project based on specific requirements.', 'technology', '{"tech-stack", "tools"}', FALSE),
('Do you offer custom solutions?', 'Yes, we excel at creating custom solutions tailored to your unique business needs. Every project is approached with your specific goals and requirements in mind.', 'customization', '{"bespoke", "tailored"}', FALSE);

-- Seed Knowledge Base
INSERT INTO public.knowledge_base (title, content, category, tags) VALUES
('Company Overview', 'Limitless Infotech specializes in web development, mobile apps, custom software, CRM systems, and AI automation. Founded with a vision to bridge the gap between technology and business success.', 'company_info', '{"company", "overview", "mission"}'),
('Service Offerings', 'Our services include responsive web design, SEO optimization, mobile app development, custom software solutions, AI automation, and brand identity design.', 'services', '{"services", "offerings", "capabilities"}'),
('Industry Expertise', 'We have successfully delivered projects for education, finance, healthcare, and technology industries. Our cross-industry experience enables us to understand diverse business needs.', 'portfolio', '{"industries", "experience", "expertise"}'),
('Technology Stack', 'We leverage modern technologies including React, Node.js, Python, AWS, Supabase, and various AI/ML frameworks to build scalable, high-performance solutions.', 'technology', '{"tech-stack", "tools", "frameworks"}'),
('Development Process', 'Our agile development process ensures transparency, collaboration, and quality. We follow industry best practices with regular communication and iterative development.', 'process', '{"methodology", "agile", "best-practices"}');

-- =============================================================================
-- SETUP COMPLETE!
-- =============================================================================

/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                           🎉 SETUP COMPLETE!                               ║
║                                                                            ║
║  Your Supabase database is now fully configured with:                     ║
║  ✅ 16 tables with comprehensive relationships and constraints            ║
║  ✅ Advanced Row Level Security policies                                  ║
║  ✅ Performance indexes                                                   ║
║  ✅ Automated triggers and functions                                      ║
║  ✅ Analytics and notification systems                                    ║
║  ✅ File upload and email logging capabilities                            ║
║  ✅ Enhanced seed data with proper JSON formatting                        ║
║  ✅ Full-text search capabilities                                         ║
║                                                                            ║
║  Key Changes Made:                                                        ║
║  • Removed vector extension for better compatibility                      ║
║  • Fixed malformed JSON in seed data                                      ║
║  • Simplified setup for broader Supabase plan support                     ║
║                                                                            ║
║  Next steps:                                                              ║
║  1. Regenerate TypeScript types:                                          ║
║     npx supabase gen types typescript --project-id YOUR_PROJECT_ID         ║
║  2. Update your src/types/supabase.ts file                                ║
║  3. Test your application                                                 ║
║  4. Set up monitoring and backups                                         ║
║                                                                            ║
║  🚀 Ready to build amazing things!                                        ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/
