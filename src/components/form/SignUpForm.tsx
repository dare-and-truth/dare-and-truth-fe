'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { postSignUp } from '@/app/api/auth.api';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const strictEmailRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|info|biz|edu|gov|mil|vn|com\.vn|net\.vn)$/;
// Validation Schema
const registerSchema = z
  .object({
    email: z
      .string()
      .nonempty('Email is required')
      .regex(strictEmailRegex, 'Invalid email address'),
    username: z
      .string()
      .nonempty('Username is required')
      .max(30, 'Username cannot exceed 30 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignUpFormData = z.infer<typeof registerSchema>;

export default function SignUpForm({
  setIsSignUpMode,
}: {
  setIsSignUpMode: (value: boolean) => void;
}) {
  const [showPassword, setShowPassword] = useState<string>('password');
  const [confirmShowpassword, setShowConfirmPassword] =
    useState<string>('password');
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
    try {
      const isSuccess = await postSignUp(signUpPayload);
      if (isSuccess) {
        setIsSignUpMode(false);
      }
    } catch (error) {}
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="auth-form sign-up-form mx-auto flex w-full flex-col items-center space-y-4 px-4 sm:px-6 md:px-8"
    >
      <div className="flex">
        <h2 className="mb-2 font-serif text-xl text-gray-500 md:text-3xl">
          Sign Up & Elevate Your Life
        </h2>
        <h2 className="animate-tilt text-xl md:text-3xl">🚀</h2>
      </div>

      <div className="w-full md:w-3/5">
        <Label htmlFor="email">Email</Label>
        <Input
          {...register('email')}
          id="email"
          type="email"
          placeholder="Example@gmail.com"
          className="h-12 w-full rounded-full bg-gray-100 px-4 text-sm text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 sm:h-14 sm:px-6 sm:text-base"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500 sm:text-sm">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="w-full md:w-3/5">
        <Label htmlFor="username">User name</Label>
        <Input
          {...register('username')}
          id="username"
          type="text"
          placeholder="Nguyen Van A"
          className="h-12 w-full rounded-full bg-gray-100 px-4 text-sm text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 sm:h-14 sm:px-6 sm:text-base"
        />
        {errors.username && (
          <p className="mt-1 text-xs text-red-500 sm:text-sm">
            {errors.username.message}
          </p>
        )}
      </div>

      <div className="relative w-full md:w-3/5">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            {...register('password')}
            id="password"
            type={showPassword}
            placeholder="At least 8 characters"
            className="h-12 w-full rounded-full bg-gray-100 px-4 pr-10 text-sm text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 sm:h-14 sm:px-6 sm:pr-12 sm:text-base"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer sm:right-4"
            onClick={() =>
              setShowPassword(showPassword === 'password' ? 'text' : 'password')
            }
          >
            {showPassword === 'password' ? (
              <Eye className="h-5 w-5" />
            ) : (
              <EyeOff className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-500 sm:text-sm">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="relative w-full md:w-3/5">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <div className="relative">
          <Input
            {...register('confirmPassword')}
            id="confirm-password"
            type={confirmShowpassword}
            placeholder="At least 8 characters"
            className="h-12 w-full rounded-full bg-gray-100 px-4 pr-10 text-sm text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 sm:h-14 sm:px-6 sm:pr-12 sm:text-base"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer sm:right-4"
            onClick={() =>
              setShowConfirmPassword(
                confirmShowpassword === 'password' ? 'text' : 'password',
              )
            }
          >
            {confirmShowpassword === 'password' ? (
              <Eye className="h-5 w-5" />
            ) : (
              <EyeOff className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-500 sm:text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" variant="login" size="login">
        Sign up
      </Button>
    </form>
  );
}
