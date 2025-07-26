import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is approved
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'admin' && token?.approved === true;
        }
        
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return token?.approved === true;
        }
        
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
};