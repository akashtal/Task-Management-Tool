'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModeToggle } from '@/components/ModeToggle';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (!res?.ok) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/check-approval?email=${data.email}`);
      const result = await response.json();

      if (response.status !== 200 || !result.approved) {
        setLoading(true);
        return;
      }

      if (result.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setLoading(false);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-muted">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input placeholder="Email" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Input type="password" placeholder="Password" {...register('password')} />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
