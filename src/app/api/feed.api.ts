import request from "@/app/utils/Axiosconfig";

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
