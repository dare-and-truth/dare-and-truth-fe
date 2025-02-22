import { LOGIN_PATH } from '@/app/constants';
import { SignUpPayload, LoginPayload } from '@/app/types';
import request from '@/app/utils/Axiosconfig';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'react-toastify';

export const postSignUp = async (
  data: SignUpPayload,
  navigate: AppRouterInstance,
) => {
  await request({
    method: 'post',
    url: '/auth/sign-up',
    data,
    onSuccess: () => {
      toast.success('Sign Up successful');
      navigate.push(LOGIN_PATH);
    },
    onError: (error) => {
      console.log('error in sign up', error);
    },
  });
};
export const postSignIn = async (data: LoginPayload) => {
  try {
    const response = await request({
      method: 'post',
      url: '/auth/sign-in',
      data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
export const postLogout = async (navigate: AppRouterInstance) => {
  await request({
    method: 'post',
    url: '/auth/logout',
    onSuccess: () => {
      navigate.push(LOGIN_PATH);
      toast.success('Logout successful');
    },
    onError: (error) => {
      console.log('error in log out', error);
    },
  });
};
