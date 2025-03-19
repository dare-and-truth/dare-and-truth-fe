import {
  CreateCommentPayload,
  CommentType,
  UpdateCommentPayload,
} from '@/app/types';
import request from '@/app/utils/Axiosconfig';

export const getCommentsByFeedId = async (
  feedId: string,
  feedUserId: string,
): Promise<CommentType[]> => {
  const response = await request({
    method: 'get',
    url: `/comments/feed/${feedId}?feedUserId=${feedUserId}`,
  });
  return response?.data as CommentType[];
};

export const getRepliesByCommentId = async (
  commentId: string,
): Promise<CommentType[]> => {
  const response = await request({
    method: 'get',
    url: `/comments/${commentId}/replies`,
  });
  return response?.data as CommentType[];
};

export const postComment = async (
  data: CreateCommentPayload,
  handleSuccess: () => void,
): Promise<void> => {
  await request({
    method: 'post',
    url: '/comments',
    data,
    onSuccess: () => {
      handleSuccess();
    },
    onError: (error) => {
      console.error('Failed to create comment', error);
    },
  });
};

export const deleteComment = async (
  commentId: string,
  onSuccess?: () => void,
): Promise<void> => {
  try {
    await request({
      method: 'delete',
      url: `/comments/${commentId}`,
      onError: (error) => {
        console.error('Failed to delete comment:', error);
      },
    });

    // Gọi callback nếu có sau khi xóa thành công
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error('Failed to delete comment:', error);
  }
};

export const updateComment = async (
  UpdateCommentPayload: UpdateCommentPayload,
  commentId: string,
  handleSuccess: () => void,
): Promise<void> => {
  await request({
    method: 'put',
    url: `/comments/${commentId}`,
    data: { content: UpdateCommentPayload.content },
    onError: (error) => {
      console.error('Failed to update comment:', error);
    },
  });
};

export const getCommentById = async (
  commentId: string,
): Promise<CommentType> => {
  const response = await request({
    method: 'get',
    url: `/comments/${commentId}`,
  });
  return response?.data as CommentType;
};
