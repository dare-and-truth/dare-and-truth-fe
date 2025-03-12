'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { ErrorFormLogin } from '@/app/types';
import { postSignIn } from '@/app/api/auth.api';
import { jwtDecode } from 'jwt-decode';
import { useLoading } from '@/app/contexts';

type JwtPayload = {
  role: string;
};

export default function LoginForm() {
  const { setIsLoading } = useLoading();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<ErrorFormLogin>({
    email: '',
    password: '',
  });
  const router = useRouter();

  const validateForm = () => {
    const errors: ErrorFormLogin = { email: '', password: '' };

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    setErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await postSignIn({ email, password });

      const { accessToken, refreshToken } = response?.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      localStorage.setItem('username', response?.data.user.username);
      localStorage.setItem('userId', response?.data.user.id);
      localStorage.setItem('avatarUrl', response?.data.user.avatar_url);

      const decoded: JwtPayload = jwtDecode(accessToken);

      const role = decoded.role;

      if (accessToken && refreshToken) {
        toast.success('Sign In successful. Welcome back!');
        if (role && role === 'admin') {
          router.push('/dashboard');
        } else {
          router.push('/home');
        }
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setErrors({ email: '', password: 'Incorrect email or password' });
      } else {
        // toast.error('An error occurred during sign in.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col-reverse md:flex-row">
      <div className="flex w-full flex-col p-6 md:w-1/2 md:p-12">
        <div
          className={`mx-auto flex w-full max-w-md flex-1 flex-col ${errors.email || errors.password ? '' : 'md:mt-8 lg:mt-8'} `}
        >
          <div className="flex-1">
            <h1 className="mb-2 text-3xl font-bold">Welcome Back 👋</h1>
            <p className="mb-8 text-gray-600">
              Today is a new day. It's your day. You shape it.
              <br />
              Sign in to start enjoying the DoDo app
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Sign in
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
              Don't you have an account?{' '}
              <Link
                href="/auth/sign-up"
                className="font-medium text-blue-600 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="h-screen w-full p-6 md:w-1/2 lg:w-1/2">
        <div className="relative h-full w-full">
          <Image
            src="/images/image-login.png"
            alt="Badminton Player Illustration"
            layout="fill"
            className="h-full w-full rounded-lg object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
