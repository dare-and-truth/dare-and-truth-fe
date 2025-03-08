import request from '@/app/utils/Axiosconfig';

export const getFeeds = async (page: number, size: number) => {
  const response = await request({
    method: 'get',
    url: `/feeds?page=${page}&size=${size}`,
    onError: () => {
      console.log('error in get feeds');
    },
  });
  return response?.data;
};

export const getFeedById = async (feedId: string, type: string) => {
  const response = await request({
    method: 'get',
    url: `/feeds/${type}/${feedId}`,
    onError: () => {
      console.log('error in get feed by id');
    },
  });
  return response?.data;
};
