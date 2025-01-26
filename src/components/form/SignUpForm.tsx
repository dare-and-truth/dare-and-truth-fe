'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { postSignUp } from '@/app/api/auth.api';

// Validation Schema
const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    username: z.string().min(2, 'Full Name is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignUpFormData = z.infer<typeof registerSchema>;

export default function SignUpForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    const signUpPayload = {
      email: data.email,
      username: data.username,
      password: data.password,
    };
    await postSignUp(signUpPayload, router);
  };

  const handleGoogleSignIn = () => {
    // Implement Google Sign-In logic
    console.log('Google sign in');
  };

  return (
    <div className="flex h-screen w-full flex-col-reverse md:flex-row">
      <div className="flex w-full flex-col p-6 md:w-1/2">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <div className="flex-1">
            <h1 className="mb-2 text-3xl font-bold">
              Get started with DODO 👋
            </h1>
            <p className="mb-4 text-gray-600">
              Today is a new day. It's your day. You shape it.
              <br />
              Sign in to start enjoying the DoDo app
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="Example@email.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="username">User name</Label>
                <Input
                  {...register('username')}
                  id="username"
                  type="text"
                  placeholder="Nguyen Van A"
                  className={errors.username ? 'border-red-500' : ''}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  {...register('password')}
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  {...register('confirmPassword')}
                  id="confirm-password"
                  type="password"
                  placeholder="At least 8 characters"
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Sign up
              </Button>
            </form>

            <div className="mt-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">Or</span>
                </div>
              </div>

              <div className="md: mt-2 space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                >
                  <FcGoogle className="mr-2 h-4 w-4" />
                  Sign in with Google
                </Button>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="font-medium text-blue-600 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="md:1/2 h-screen w-full p-6 lg:w-1/2">
        <div className="relative h-full w-full">
          <Image
            src="/images/image-login.png"
            alt="Badminton Player Illustration"
            fill
            className="h-full w-full rounded-lg object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
