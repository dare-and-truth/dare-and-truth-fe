'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
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
    setIsSignUpMode(false);
  };


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="auth-form sign-up-form space-y-4"
    >
      <h2 className="mb-2 text-3xl text-gray-500">Welcome 👋</h2>

      <div className="w-3/5">
        <Label htmlFor="email">Email</Label>
        <Input
          {...register('email')}
          id="email"
          type="email"
          placeholder="Example@email.com"
          className="h-14 w-full rounded-full bg-gray-100 px-6 text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="w-3/5">
        <Label htmlFor="username">User name</Label>
        <Input
          {...register('username')}
          id="username"
          type="text"
          placeholder="Nguyen Van A"
          className="h-14 w-full rounded-full bg-gray-100 px-6 text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}
      </div>

      <div className="relative w-3/5">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            {...register('password')}
            id="password"
            type={showPassword}
            placeholder="At least 8 characters"
            className="h-14 w-full rounded-full bg-gray-100 px-6 pr-12 text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
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
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="relative w-3/5">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <div className="relative">
          <Input
            {...register('confirmPassword')}
            id="confirm-password"
            type={confirmShowpassword}
            placeholder="At least 8 characters"
            className="h-14 w-full rounded-full bg-gray-100 px-6 pr-12 text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() =>
              setShowConfirmPassword(
                confirmShowpassword == 'password' ? 'text' : 'password',
              )
            }
          >
            {confirmShowpassword === 'password' ? <Eye /> : <EyeOff />}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="text-sm text-red-500">
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
