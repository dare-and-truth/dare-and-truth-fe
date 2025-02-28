import request from "@/app/utils/Axiosconfig";

export const getChallengeBySearchChallenge = async (searchChallenge: string) => {
  const response = await request({
    method: 'get',
    url: `/search/challenge?keyword=${searchChallenge}`,
  });
  console.log("search challenge", response?.data)
  return response?.data;
};

export const getUserBySearchUser = async (
  searchUser: string,
) => {
  const response = await request({
    method: 'get',
    url: `/search/user?keyword=${searchUser}`,
  });
  return response?.data;
};
