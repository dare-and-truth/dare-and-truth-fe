import { LOGIN_PATH } from '@/app/constants';
import { SignUpPayload } from '@/app/types';
import request from '@/app/utils/Axiosconfig';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const postSignUp = async (
  data: SignUpPayload,
  navigate: AppRouterInstance,
) => {
  await request({
    method: 'post',
    url: '/auth/sign-up',
    data,
    onSuccess: () => {
      navigate.push(LOGIN_PATH);
    },
    onError: (error) => {
      console.log('error in sign up', error);
    },
  });
};
