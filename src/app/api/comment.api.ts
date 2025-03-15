import { CreateCommentPayload, CommentType, UpdateCommentPayload } from '@/app/types';
import request from '@/app/utils/Axiosconfig';

/**
 * Lấy danh sách comment theo Feed ID
 * @param feedId ID của bài đăng
 * @returns Danh sách comment
 */
export const getCommentsByFeedId = async (feedId: string): Promise<CommentType[]> => {
  const response = await request({
    method: 'get',
    url: `/comments/feed/${feedId}`,
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
      console.error('Lỗi khi tạo comment:', error);
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
        console.error('Lỗi khi xóa comment:', error);
      },
    });

    // Gọi callback nếu có sau khi xóa thành công
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error('Lỗi khi xóa comment:', error);
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
      console.error('Lỗi khi cập nhật comment:', error);
    },
  });
};
