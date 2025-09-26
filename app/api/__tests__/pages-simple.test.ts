import { GET } from '../pages/route';
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

describe('/api/pages GET', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
