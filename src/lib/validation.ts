import { z } from 'zod';

// Sanitization helper
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

// Page validation schemas
export const pageUpdateSchema = z.object({
  page_name: z.string().min(1, 'Page name is required').max(100, 'Page name too long'),
  content: z.any(), // JSON content
  is_published: z.boolean(),
});

// Lead validation schemas
export const leadSchema = z.object({
  business_basics: z.any(),
  project_details: z.any(),
  timeline_budget: z.any(),
  source_page: z.string().optional(),
});

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number').optional(),
  company: z.string().max(100, 'Company name too long').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
  service_interest: z.string().optional(),
});

// FAQ validation
export const faqSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters').max(500, 'Question too long'),
  answer: z.string().min(10, 'Answer must be at least 10 characters').max(2000, 'Answer too long'),
});

// Testimonial validation
export const testimonialSchema = z.object({
  client_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  company: z.string().max(100, 'Company name too long').optional(),
  position: z.string().max(100, 'Position too long').optional(),
  content: z.string().min(20, 'Testimonial must be at least 20 characters').max(1000, 'Testimonial too long'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  is_featured: z.boolean().optional(),
});

// Portfolio project validation
export const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000, 'Description too long'),
  technologies: z.array(z.string()).min(1, 'At least one technology required'),
  category: z.string().min(1, 'Category is required'),
  client_name: z.string().max(100, 'Client name too long').optional(),
  project_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  github_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  images: z.array(z.string().url('Invalid image URL')).optional(),
  is_featured: z.boolean().optional(),
});

// Team member validation
export const teamMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  position: z.string().min(2, 'Position must be at least 2 characters').max(100, 'Position too long'),
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(1000, 'Bio too long'),
  email: z.string().email('Invalid email address'),
  linkedin_url: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  image_url: z.string().url('Invalid image URL').optional().or(z.literal('')),
  is_active: z.boolean().optional(),
});

// Chat message validation
export const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long'),
  sessionId: z.string().uuid('Invalid session ID'),
});

// User profile validation
export const userProfileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number').optional(),
  company: z.string().max(100, 'Company name too long').optional(),
  position: z.string().max(100, 'Position too long').optional(),
  bio: z.string().max(500, 'Bio too long').optional(),
});

// File upload validation
export const fileUploadSchema = z.object({
  fileName: z.string().min(1, 'File name is required').max(255, 'File name too long'),
  fileSize: z.number().max(10 * 1024 * 1024, 'File size cannot exceed 10MB'), // 10MB limit
  mimeType: z.string().refine(
    (type: string) => ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(type),
    'Unsupported file type'
  ),
});

// Generic validation helper
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.issues.map((e) => e.message) };
    }
    return { success: false, errors: ['Invalid data format'] };
  }
}

// Sanitize object fields recursively
export function sanitizeObject(obj: unknown): unknown {
  if (typeof obj === 'string') {
    return sanitizeInput(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  if (obj && typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  return obj;
}
