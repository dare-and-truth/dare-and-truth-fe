'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { ErrorFormLogin } from '@/app/types';
import { postSignIn } from '@/app/api/auth.api';
import { jwtDecode } from 'jwt-decode';
import { useLoading } from '@/app/contexts';
import { Eye, EyeOff } from 'lucide-react';

type JwtPayload = {
  role: string;
};

export default function SignInForm() {
  const { setIsLoading } = useLoading();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<ErrorFormLogin>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<string>('password');

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
    <form
      onSubmit={handleSubmit}
      className="auth-form sign-in-form mx-auto flex w-full flex-col items-center space-y-4 px-4 sm:px-6 md:px-8"
    >
      <Image
        src="/images/old-logo.png"
        alt="image"
        width={0}
        height={0}
        className="h-32 w-32 animate-pulse object-cover"
      />
      <div className="flex">
        <h2 className="mb-2 mr-2 font-serif text-xl text-gray-500 md:text-3xl">
          Welcome Back
        </h2>
        <h2 className="animate-tilt text-xl md:text-3xl">👋</h2>
      </div>

      <div className="w-full md:w-3/5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="user@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-14 w-full rounded-full bg-gray-100 px-6 pr-12 text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="relative w-full md:w-3/5">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword}
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-14 w-full rounded-full bg-gray-100 px-6 pr-10 text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() =>
              setShowPassword(showPassword == 'password' ? 'text' : 'password')
            }
          >
            {showPassword === 'password' ? <Eye /> : <EyeOff />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <Button type="submit" variant="login" size="login">
        Sign in
      </Button>
    </form>
  );
}
