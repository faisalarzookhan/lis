import { NextRequest } from 'next/server';
import { GET, POST } from '../pages/route';
import { createServerClient } from '@supabase/ssr';

// Mock the createServerClient and cookies
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

describe('/api/pages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/pages', () => {
    it('should return pages successfully', async () => {
      const mockPages = [
        { id: 1, page_name: 'Home', is_published: true },
        { id: 2, page_name: 'About', is_published: true },
      ];

      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data: mockPages, error: null })),
          })),
        })),
      };

      (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

      const response = await GET();
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.pages).toEqual(mockPages);
    });

    it('should handle database errors', async () => {
      const mockError = { message: 'Database connection failed' };

      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data: null, error: mockError })),
          })),
        })),
      };

      (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

      const response = await GET();
      const result = await response.json();

      expect(response.status).toBe(500);
      expect(result.error).toBe('Database connection failed');
    });
  });

  describe('POST /api/pages', () => {
    it('should create page successfully', async () => {
      const pageData = {
        page_name: 'New Page',
        content: { title: 'New Page Title' },
        is_published: false,
      };

      const mockSupabase = {
        from: jest.fn(() => ({
          insert: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({ data: { id: 1 }, error: null })),
            })),
          })),
        })),
      };

      (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

      const request = new NextRequest('http://localhost:3000/api/pages', {
        method: 'POST',
        body: JSON.stringify(pageData),
      });
      const response = await POST(request);
      const result = await response.json();

      expect(response.status).toBe(201);
      expect(result.id).toBe(1);
    });

    it('should handle missing page name', async () => {
      const invalidData = {
        content: { title: 'Test' },
        is_published: true,
      };

      const request = new NextRequest('http://localhost:3000/api/pages', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });
      const response = await POST(request);
      const result = await response.json();

      expect(response.status).toBe(400);
      expect(result.error).toBe('Page name is required');
    });

    it('should handle database errors', async () => {
      const pageData = {
        page_name: 'Test Page',
        content: { title: 'Test' },
        is_published: true,
      };

      const mockError = { message: 'Insert failed' };
      const mockSupabase = {
        from: jest.fn(() => ({
          insert: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({ data: null, error: mockError })),
            })),
          })),
        })),
      };

      (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

      const request = new NextRequest('http://localhost:3000/api/pages', {
        method: 'POST',
        body: JSON.stringify(pageData),
      });
      const response = await POST(request);
      const result = await response.json();

      expect(response.status).toBe(500);
      expect(result.error).toBe('Insert failed');
    });
  });
});
