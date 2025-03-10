import request from '@/app/utils/Axiosconfig';

export const getChallengeBySearchChallenge = async (
  searchChallenge: string,
) => {
  const response = await request({
    method: 'get',
    url: `/search/challenge?keyword=${searchChallenge}`,
  });
  return response?.data;
};

export const getUserBySearchUser = async (searchUser: string) => {
  const response = await request({
    method: 'get',
    url: `/search/user?keyword=${searchUser}`,
  });
  return response?.data;
};
