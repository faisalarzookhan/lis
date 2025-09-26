describe('supabaseClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should create Supabase client when environment variables are provided', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

    // Re-import the module to trigger the client creation
    const { supabase } = await import('../supabaseClient');

    expect(supabase).toBeDefined();
    // Since we can't mock createClient easily for top-level, we just check it doesn't throw
  });

  it('should throw error when NEXT_PUBLIC_SUPABASE_DATABASE_URL is missing', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
    delete process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL;

    await expect(async () => {
      await import('../supabaseClient');
    }).rejects.toThrow('Supabase URL and Anon Key must be provided in .env.local');
  });

  it('should throw error when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL = 'https://test.supabase.co';
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    await expect(async () => {
      await import('../supabaseClient');
    }).rejects.toThrow('Supabase URL and Anon Key must be provided in .env.local');
  });

  it('should throw error when both environment variables are missing', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    await expect(async () => {
      await import('../supabaseClient');
    }).rejects.toThrow('Supabase URL and Anon Key must be provided in .env.local');
  });
});
