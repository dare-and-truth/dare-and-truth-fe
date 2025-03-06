import { use } from 'react';
import ProfileChallengeDoing from '@/components/ProfileChallengeDoing';
import ProfileHeader from '@/components/ProfileHeader';
export default function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  return (
    <main className="bg-gray-100 bg-opacity-25">
      <div className="mb-8 lg:mx-auto lg:w-8/12">
        <ProfileHeader userId={userId} />
        <ProfileChallengeDoing userId={userId} />
      </div>
    </main>
  );
}
