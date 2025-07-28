import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
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