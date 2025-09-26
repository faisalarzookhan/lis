# Implementation Plan

Fix the 404 error on `/admin/pages/1/edit` by correcting the route structure, fixing component bugs, and ensuring proper database seeding for page management functionality.

This implementation addresses a critical admin panel issue where users cannot edit existing pages due to incorrect routing and missing database data. The fix involves restructuring the file system to match Next.js routing conventions, correcting a component bug, and ensuring the database contains the necessary page records for testing and functionality.

[Types]
No new type definitions are required for this implementation as existing page-related types are already defined in the codebase.

[Files]
- New files to be created (with full paths and purpose)
  - app/admin/pages/[id]/edit/page.tsx - Move the existing edit page component to the correct route path for `/admin/pages/[id]/edit`
- Existing files to be modified (with specific changes)
  - src/components/admin/PagesManagement.tsx - Add missing showCreateModal state variable and modal component to enable page creation functionality
  - scripts/seed-database.ts - Ensure the seeding script includes proper page records with sequential IDs for testing
- Files to be deleted or moved
  - app/admin/pages/[id]/page.tsx - Delete this file after moving its contents to the correct edit route
- Configuration file updates
  - None required

[Functions]
- New functions (name, signature, file path, purpose)
  - None required
- Modified functions (exact name, current file path, required changes)
  - fetchPages in src/components/admin/PagesManagement.tsx - Add error handling for API failures
- Removed functions (name, file path, reason, migration strategy)
  - None

[Classes]
- New classes (name, file path, key methods, inheritance)
  - None
- Modified classes (exact name, file path, specific modifications)
  - None
- Removed classes (name, file path, replacement strategy)
  - None

[Dependencies]
No new packages are required as all necessary dependencies are already installed.

[Testing]
- Test file requirements
  - Update existing API tests in app/api/__tests__/ to include tests for the corrected page edit endpoint
  - Add component tests for the fixed PagesManagement modal functionality
- Existing test modifications
  - Modify jest.config.cjs to include the new route path in test coverage
- Validation strategies
  - Manual testing: Navigate to `/admin/pages/1/edit` and verify the page loads without 404
  - API testing: Ensure GET `/api/pages/1` returns valid page data
  - Component testing: Verify the create page modal opens and functions correctly

[Implementation Order]
1. Move the edit page component from `app/admin/pages/[id]/page.tsx` to `app/admin/pages/[id]/edit/page.tsx` to correct the routing structure
2. Delete the old `app/admin/pages/[id]/page.tsx` file
3. Add the missing `showCreateModal` state and modal component to `src/components/admin/PagesManagement.tsx`
4. Run the database seeding script to ensure test pages exist with proper IDs
5. Test the edit functionality by navigating to `/admin/pages/1/edit`
6. Update and run tests to validate the fixes
