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
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 px-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl mx-auto py-20 flex flex-col gap-16"
      >
        {/* HERO SECTION */}
        <section className="text-center px-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg mb-6">
            <User className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 mb-6">
            Welcome to Task Manager
          </h1>

          <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            A powerful tool for modern teams with role-based access, admin workflows, and secure dashboards.
          </p>
        </section>

        {/* ACTION CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4">
          {/* User Card */}
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border shadow-md">
              <CardHeader className="items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                </div>
                <CardTitle className="text-lg text-center text-gray-800 dark:text-white">
                  User Access
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Login to your dashboard and manage tasks effortlessly.
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

          {/* Admin Card */}
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border shadow-md">
              <CardHeader className="items-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-red-600 dark:text-red-300" />
                </div>
                <CardTitle className="text-lg text-center text-gray-800 dark:text-white">
                  Admin Panel
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Admin dashboard to manage users and access permissions.
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
        </section>

        {/* REGISTER CARD */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-800 p-6 rounded-xl text-center shadow-md border mx-4"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            New to Task Manager?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Create an account and get started. Admin approval is required.
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
