'use client';
import dynamic from 'next/dynamic';
// Tải động CreatePostForm, tắt SSR
const CreateChallengeForm = dynamic(
  () => import('@/components/form/CreateChallengeForm'),
  {
    ssr: false, // Chỉ chạy ở client-side
    loading: () => <p>Loading form...</p>, // Hiển thị trong lúc tải
  },
);
export default function CreateChallengePage() {
  return (
    <div
      className="h-[calc(100vh-4rem)] overflow-y-auto p-7 pb-20 md:pb-4"
      id="scrollableDiv"
    >
      <div className="mx-auto max-w-2xl rounded-2xl p-4 shadow-lg">
        <CreateChallengeForm />
      </div>
    </div>
  );
}
