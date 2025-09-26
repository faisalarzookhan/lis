// jest.setup.js
import '@testing-library/jest-dom';
global.Request = class Request { /* mock implementation */ };
global.Response = class Response { /* mock implementation */ };
global.NextRequest = global.Request;
global.NextResponse = { json: (data) => new Response(JSON.stringify(data)) };
