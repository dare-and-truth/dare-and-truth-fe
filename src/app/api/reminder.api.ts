'use client';

import {
  CreateReminderRequest,
  UpdateReminderRequest,
  ReminderSummaryProjection,
  HashtagForDoChallengeResponse
} from '@/app/types'; 
import request from '@/app/utils/Axiosconfig';
import { AxiosError } from 'axios';

// API để tạo một reminder mới
export const createReminder = async (
  data: CreateReminderRequest,
  handleSuccess: () => void,
  handleError?: (error: any) => void,
) => {
  await request({
    method: 'post',
    url: '/reminders', 
    data,
    onSuccess: handleSuccess,
    onError: (error: AxiosError) => {
      console.log('Error when creating reminder:', error);
      handleError?.(error);
      throw error;
    },
  });
};

// API để lấy tất cả reminders theo ngày
export const getAllRemindersByDate = async (date: string): Promise<ReminderSummaryProjection[]> => {
  const response = await request({
    method: 'get',
    url: `/reminders?date=${date}`, 
    onError: (error: AxiosError) => {
      console.log('Error when fetching reminders:', error);
      throw error;
    },
  });
  return response?.data || []; 
};

// API để cập nhật một reminder
export const updateReminder = async (
  reminderId: string,
  data: UpdateReminderRequest,
  handleSuccess: (response: any) => void,
  handleError?: (error: any) => void,
) => {
  await request({
    method: 'patch',
    url: `/reminders/${reminderId}`, 
    data,
    onSuccess: handleSuccess,
    onError: (error: AxiosError) => {
      console.log('Error when updating reminder:', error);
      handleError?.(error);
      throw error;
    },
  });
};

// API để xóa một reminder
export const deleteReminder = async (
  reminderId: string,
  handleSuccess: (response: any) => void,
  handleError?: (error: any) => void,
) => {
  await request({
    method: 'delete',
    url: `/reminders/${reminderId}`, 
    onSuccess: handleSuccess,
    onError: (error: AxiosError) => {
      console.log('Error when deleting reminder:', error);
      handleError?.(error);
      throw error;
    },
  });
};

// API để lấy tất cả reminders theo ngày
export const getHashtags = async (): Promise<HashtagForDoChallengeResponse[]> => {
  const response = await request({
    method: 'get',
    url: `/reminders/hashtags`,
    onError: (error: AxiosError) => {
      console.log('Error when fetching reminders:', error);
      throw error;
    },
  });
  return response?.data || [];
};