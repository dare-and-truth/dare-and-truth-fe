import { Button } from '@/components/ui/button';
import { MessageSquare, Share } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {

  return (
    <div className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-4 pb-20 md:pb-4">
      <div className="mb-4 rounded-lg bg-white p-4 shadow-sm md:p-6">
        <div className="mb-4 flex items-center">
          <Image
            src="/images/default-profile.png"
            alt="User"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="ml-3">
            <h3 className="font-semibold">Lam Nhat</h3>
            <p className="text-sm text-gray-500">2 days ago</p>
          </div>
          <Button
            variant="default"
            className="ml-auto bg-blue-600 font-semibold"
          >
            JOIN
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold">#21DayYogaChallenge</h2>
            <p className="mt-2 text-gray-800">
              We're excited to introduce our "21-Day Journey to Inner Harmony"
              starting soon!
            </p>

            <div className="mt-4 space-y-2">
              <p className="font-semibold">Challenge Rules:</p>
              <p>
                🎯 Goal: Practice yoga for at least 30 minutes every day and
                share your favorite poses or sessions with the community using
                our challenge hashtag.
              </p>
              <p>
                📍 Location: At home, in the park, or anywhere you feel
                comfortable!
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <p className="font-semibold">How to Participate:</p>
              <ul className="list-inside list-disc space-y-1">
                <li>
                  Click the "Join Challenge" button and choose your preferred
                  time.
                </li>
                <li>
                  After signing up, you'll receive a success notification and be
                  able to share your progress with the community.
                </li>
                <li>
                  Don't forget to tag your posts with our official hashtag for a
                  chance to be featured!
                </li>
              </ul>
            </div>

            <div className="mt-4">
              <p className="font-semibold">Rewards:</p>
              <p>
                🏆 Completion Prize: A premium yoga mat to support your ongoing
                wellness journey!
              </p>
            </div>
          </div>

          <Image
            src="/images/logo.png"
            alt="Yoga class"
            width={600}
            height={400}
            className="w-full rounded-lg object-cover"
          />

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-gray-600">
              <MessageSquare className="h-6 w-6" />
              <span>200</span>
            </button>
            <button className="flex items-center gap-2 text-blue-600">
              <MessageSquare className="h-6 w-6" />
              <span>50</span>
            </button>
            <button className="ml-auto">
              <Share className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
