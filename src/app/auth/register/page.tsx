'use client';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ModeToggle } from '@/components/ModeToggle';

const registerSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterSchema = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data: RegisterSchema) => {
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast({
          title: 'Registration failed',
          description: result.message || 'Something went wrong.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      toast({
        title: 'Success!',
        description: 'Account created. Logging in...',
      });

      const login = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (login?.ok) {
        router.push('/dashboard');
      } else {
        toast({
          title: 'Login failed',
          description: 'Please try to log in manually.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Could not complete registration.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-muted">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input placeholder="Email" {...register('email')} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <Input type="password" placeholder="Password" {...register('password')} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <Input type="password" placeholder="Confirm Password" {...register('confirmPassword')} />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border text-sm text-blue-800 border-blue-200">
              <strong>Note:</strong> Accounts require admin approval unless you're the admin.
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
