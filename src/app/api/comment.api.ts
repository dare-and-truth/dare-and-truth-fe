import { CreateCommentPayload, CommentType, UpdateCommentPayload } from '@/app/types';
import request from '@/app/utils/Axiosconfig';

/**
 * Lấy danh sách comment theo Feed ID
 * @param feedId ID của bài đăng
 * @returns Danh sách comment
 */
export const getCommentsByFeedId = async (feedId: string, feedUserId:string): Promise<CommentType[]> => {
  const response = await request({
    method: 'get',
    url: `/comments/feed/${feedId}?feedUserId=${feedUserId}`,
  });
  return response?.data as CommentType[];
};

/**
 * Lấy danh sách phản hồi của một comment theo commentId
 * @param commentId ID của comment gốc
 * @returns Danh sách replies
 */
export const getRepliesByCommentId = async (commentId: string): Promise<CommentType[]> => {
  const response = await request({
    method: 'get',
    url: `/comments/${commentId}/replies`,
  });
  return response?.data as CommentType[];
};


/**
 * Tạo comment mới
 * @param data Dữ liệu comment cần tạo
 * @param handleSuccess Hàm callback khi tạo thành công
 */
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

/**
 * Xóa comment theo ID
 * @param commentId ID của comment cần xóa
 */
export const deleteComment = async (commentId: string, onSuccess?: () => void): Promise<void> => {
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

/**
 * Cập nhật nội dung comment
 * @param commentId ID của comment cần cập nhật
 * @param content Nội dung mới của comment
 */
export const updateComment = async (
UpdateCommentPayload: UpdateCommentPayload, commentId:string, handleSuccess: () => void,
): Promise<void> => {
  await request({
    method: 'put',
    url: `/comments/${commentId}`, 
    data:  { content: UpdateCommentPayload.content }, 
    onError: (error) => {
      console.error('Failed to update comment:', error);
    },
  });
};

/**
 * Lấy thông tin chi tiết của một comment theo ID
 * @param commentId ID của comment cần lấy
 * @returns Thông tin comment
 */
export const getCommentById = async (commentId: string): Promise<CommentType> => {
  const response = await request({
    method: 'get',
    url: `/comments/${commentId}`,
  });
  return response?.data as CommentType;
};
