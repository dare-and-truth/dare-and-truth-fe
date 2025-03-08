// // components/FriendRequestCard.tsx
// import { Button } from '@/components/ui/button';
// import { useEffect, useState, useMemo } from 'react';
// import {
//   acceptFriendRequest,
//   rejectFriendRequest,
//   unFriend,
//   createFriendRequest,
// } from '@/app/api/friends.api';
// import { toast } from 'react-toastify';
// import { FriendRequestCardProps } from '@/app/types';
// import Image from 'next/image';
// import Link from 'next/link';

// export default function FriendRequestButton({
//   userId,
//   onAccept,
//   onReject,
//   onUnfriend,
//   onAddFriend,
//   mode = 'requests', // Prop mới để kiểm soát chế độ: 'requests', 'friends', hoặc 'search'
// }: FriendRequestCardProps) {
//   const [isAccepted, setIsAccepted] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Lấy userId từ localStorage
//   const currentUserId = localStorage.getItem('userId');

//   const isCurrentUserReceiver = userId === currentUserId;

//   const handleAddFriend = async () => {
//     if (!userId || !currentUserId) {
//       toast.error('Invalid user ID.');
//       return;
//     }
//     setLoading(true);
//     try {
//       await createFriendRequest({ userId, followerId: currentUserId }, () => {
//         setIsAccepted(false);
//         onAddFriend?.(userId, currentUserId);
//         toast.success('Friend request sent!');
//       });
//     } catch (error) {
//       toast.error('Failed to send friend request.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAccept = async () => {
//     if (!requestId || !currentUserId) {
//       toast.error('Invalid request or user ID.');
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await acceptFriendRequest(
//         requestId,
//         (response) => {
//           setIsAccepted(true);
//           onAccept?.(requestId);
//           toast.success('Friend request accepted!');
//         },
//         (error) => {
//           toast.error('Failed to accept friend request.');
//         },
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReject = async () => {
//     if (!requestId || !currentUserId) {
//       toast.error('Invalid request or user ID.');
//       return;
//     }
//     setLoading(true);
//     try {
//       await rejectFriendRequest(
//         requestId,
//         (response) => {
//           onReject?.(requestId);
//           toast.info('Friend request rejected.');
//         },
//         (error) => {
//           toast.error('Failed to reject friend request.');
//         },
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUnfriend = async () => {
//     if (!requestId || !currentUserId || !followerId || !userId) {
//       toast.error('Invalid request or user IDs.');
//       return;
//     }
//     setLoading(true);
//     try {
//       const friendId = currentUserId === userId ? followerId : userId; // ID của người bạn cần xóa
//       if (!friendId) {
//         throw new Error('Friend ID is undefined.');
//       }

//       const response = await unFriend(
//         friendId,
//         (response) => {
//           onUnfriend?.(requestId);
//           setIsAccepted(false);
//           toast.info('You have unfriended this user.');
//         },
//         (error) => {
//           toast.error('Failed to unfriend.');
//         },
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className={`mb-4 flex items-center rounded-lg bg-white p-4 shadow-sm transition-all duration-300`}
//     >

//       <div className="ml-auto flex items-center gap-2">
//         {mode === 'requests' ? (
//           requestId ? (
//             isAccepted ? (
//               <Button
//                 variant="outline"
//                 className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white"
//                 onClick={handleUnfriend}
//                 disabled={loading}
//               >
//                 {loading ? 'Unfriending...' : 'Unfriend'}
//               </Button>
//             ) : isCurrentUserReceiver ? (
//               <>
//                 <Button
//                   variant="default"
//                   className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
//                   onClick={handleAccept}
//                   disabled={loading}
//                 >
//                   {loading ? 'Accepting...' : 'Accept'}
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white"
//                   onClick={handleReject}
//                   disabled={loading}
//                 >
//                   {loading ? 'Rejecting...' : 'Reject'}
//                 </Button>
//               </>
//             ) : null // Không hiển thị gì nếu không phải người nhận
//           ) : (
//             <Button
//               variant="default"
//               className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
//               onClick={handleAddFriend}
//               disabled={loading}
//             >
//               {loading ? 'Adding...' : 'Add Friend'}
//             </Button>
//           )
//         ) : mode === 'friends' ? (
//           requestId &&
//           isAccepted && (
//             <Button
//               variant="outline"
//               className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white"
//               onClick={handleUnfriend}
//               disabled={loading}
//             >
//               {loading ? 'Unfriending...' : 'Unfriend'}
//             </Button>
//           )
//         ) : // Mode 'search'
//         userId && currentUserId ? (
//           requestId ? (
//             isAccepted ? (
//               <Button
//                 variant="outline"
//                 className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white"
//                 onClick={handleUnfriend}
//                 disabled={loading}
//               >
//                 {loading ? 'Unfriending...' : 'Unfriend'}
//               </Button>
//             ) : isCurrentUserSender ? (
//               <span className="font-semibold text-gray-500">Request Sent</span>
//             ) : isCurrentUserReceiver ? (
//               <>
//                 <Button
//                   variant="default"
//                   className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
//                   onClick={handleAccept}
//                   disabled={loading}
//                 >
//                   {loading ? 'Accepting...' : 'Accept'}
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white"
//                   onClick={handleReject}
//                   disabled={loading}
//                 >
//                   {loading ? 'Rejecting...' : 'Reject'}
//                 </Button>
//               </>
//             ) : null
//           ) : (
//             <Button
//               variant="default"
//               className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
//               onClick={handleAddFriend}
//               disabled={loading}
//             >
//               {loading ? 'Adding...' : 'Add Friend'}
//             </Button>
//           )
//         ) : null}
//       </div>
//     </div>
//   );
// }
