import { use } from 'react';
import ProfileChallengeDoing from '@/components/ProfileChallengeDoing';
import ProfileHeader from '@/components/ProfileHeader';
export default function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto p-7 pb-20 md:pb-4">
      <div className="mx-auto max-w-2xl">
        <ProfileHeader userId={userId} />
        <ProfileChallengeDoing userId={userId} />
      </div>
    </div>
  );
}
