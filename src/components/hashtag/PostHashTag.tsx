'use client';
import { FeedType } from '@/app/types';
import Image from 'next/image';
import Link from 'next/link';

export default function PostHashTag({ posts }: { posts: FeedType[] }) {
  return (
    <>
      <h2 className="my-4 text-xl font-bold">Do Challenge</h2>
      <div className="grid grid-flow-row grid-cols-3 justify-items-stretch gap-2 text-neutral-600 md:grid-cols-3 md:gap-8 lg:grid-cols-3 xl:grid-cols-5">
        {posts.map((item) => (
          <div
            key={item.id}
            className="relative h-60 w-full overflow-hidden rounded-md border border-gray-200"
          >
            <Link
              href={`/feed/${item.type}/${item.id}`}
              className="block h-full w-full"
            >
              <Image
                src={item.mediaUrl}
                alt="Feed Image"
                width={0}
                height={0}
                className="h-full w-full object-cover"
              />
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
