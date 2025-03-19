import request from '@/app/utils/Axiosconfig';

// Types
export interface NotificationResponse {
  id: string;
  type: string;
  sender: {
    id: string;
    username: string;
  };
  isRead: boolean;
  createdAt: string;
  relatedEntity: any; // Có thể là Post, Challenge, hoặc Reminder
}

// Lấy danh sách notification của user
export const getUserNotifications = async (
  receiverId: string,
  params?: {
    page?: number;
    size?: number;
    sort?: string;
  },
  handleSuccess?: (data: Page<NotificationResponse>) => void,
) => {
  await request({
    method: 'get',
    url: `/notifications/user/${receiverId}`,
    params: {
      page: params?.page || 0,
      size: params?.size || 10,
      sort: params?.sort || 'createdAt,desc',
    },
    onSuccess: (data) => {
      handleSuccess && handleSuccess(data);
    },
    onError: (error) => {
      console.log('Error in get user notifications', error);
    },
  });
};

// Lấy số lượng notification chưa đọc của user
export const getUnreadNotificationsCount = async () => {
  const response = await request({
    method: 'get',
    url: `/notifications/unread/count`,
  });
  return response?.data;
};

// Đánh dấu notification đã đọc
export const markNotificationAsRead = async (
  notificationId: string,
  handleSuccess?: () => void,
) => {
  await request({
    method: 'put',
    url: `/notifications/${notificationId}/read`,
    onSuccess: () => {
      handleSuccess && handleSuccess();
    },
    onError: (error) => {
      console.log('Error in mark notification as read', error);
    },
  });
};

// Type cho phân trang
interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
