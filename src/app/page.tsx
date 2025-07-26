'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ModeToggle } from '@/components/ModeToggle';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      if (session.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (session) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-100 px-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl space-y-16"
      >
        {/* Hero Section */}
        <section className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-md">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 mb-6">
        Welcome to Task Management
      </h1>
      <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto mb-8">
        Role-based access, admin approval workflows, and secure dashboards built for modern teams to manage tasks efficiently.
      </p>
        </section>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Access */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="backdrop-blur-sm border bg-white/80 shadow-lg">
              <CardHeader className="items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-center">User Access</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Login to access your personal dashboard and manage your profile.
                </p>
                <Link href="/auth/login">
                  <Button className="w-full">
                    Sign In
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Admin Panel */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="backdrop-blur-sm border bg-white/80 shadow-lg">
              <CardHeader className="items-center">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-xl text-center">Admin Panel</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Admin login for managing users and overseeing platform access.
                </p>
                <Link href="/auth/login">
                  <Button variant="destructive" className="w-full">
                    Admin Login
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Create Account */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 p-6 text-center border shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">New to SecureApp?</h3>
          <p className="text-gray-600 mb-4">
            Register now and get started. All new accounts require admin approval.
          </p>
          <Link href="/auth/register">
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
              Create Account
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
