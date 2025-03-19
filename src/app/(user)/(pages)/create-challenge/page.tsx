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
    <div className="mx-auto mt-20 w-2/3 max-w-2xl rounded-2xl bg-white p-4 pb-20 shadow-lg md:pb-4">
      <CreateChallengeForm />
    </div>
  );
}
