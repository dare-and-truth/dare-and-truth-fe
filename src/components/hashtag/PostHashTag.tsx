'use clienr';
import { id } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';

export default function PostHashTag({ hashtag,posts }: { hashtag: string, posts: any }) {
  const data = [
    {
      id: 1,
      name: 'Linghgh',
      image: '/images/monster-levelone.png',
    },
    {
      id: 2,
      name: 'Linghgh',
      image: '/images/monster-levelone.png',
    },
    {
      id: 3,
      name: 'Linghgh',
      image: '/images/monster-levelone.png',
    },
    {
      id: 4,
      name: 'Linghgh',
      image: '/images/monster-levelone.png',
    },
    {
      id: 5,
      name: 'Linghgh',
      image: '/images/monster-levelone.png',
    },
    {
      id: 6,
      name: 'Linghgh',
      image: '/images/monster-levelone.png',
    },
  ];
  return (
    <div className="grid grid-flow-row grid-cols-3 justify-items-stretch gap-2 text-neutral-600 md:grid-cols-3 md:gap-8 lg:grid-cols-3 xl:grid-cols-5">
      {data.map((item) => (
        <div className="mt-4" key={item.id}>
          <Link href="#" className="cursor-pointer">
            <Image
              src={item.image}
              className="dark:shadow-gray-900object-cover h-full w-full rounded-md border border-gray-200"
              alt="Monster Level One"
              width={0}
              height={0}
            />
          </Link>
        </div>
      ))}
    </div>
  );
}
