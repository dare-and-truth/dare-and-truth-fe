import { useState } from 'react';
import { Grid, Heart, MessageCircle, Square } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ChallengeDoing() {
  const [activeTab, setActiveTab] = useState<'challenges' | 'posts'>(
    'challenges',
  );

  return (
    <div className="px-px md:px-3">
      {/* Tabs */}
      <ul className="flex items-center justify-around space-x-12 border-t text-xs font-semibold uppercase tracking-widest text-gray-600 md:justify-center">
        <li
          className={`md:-mt-px md:border-t ${
            activeTab === 'challenges'
              ? 'md:border-gray-700 md:text-gray-700'
              : ''
          }`}
        >
          <button
            className="flex items-center p-3"
            onClick={() => setActiveTab('challenges')}
          >
            <Grid className="mr-1 h-5 w-5 md:h-4 md:w-4" />
            <span>Challenges</span>
          </button>
        </li>
        <li
          className={`md:-mt-px md:border-t ${
            activeTab === 'posts' ? 'md:border-gray-700 md:text-gray-700' : ''
          }`}
        >
          <button
            className="flex items-center p-3"
            onClick={() => setActiveTab('posts')}
          >
            <Square className="mr-1 h-5 w-5 md:h-4 md:w-4" />
            <span>Posts</span>
          </button>
        </li>
      </ul>

      {/* Nội dung dựa trên tab được chọn */}
      {activeTab === 'challenges' ? (
        <div className="p-4 text-center text-lg font-semibold">
          Danh sách Challenges
        </div>
      ) : (
        <div className="-mx-px flex flex-wrap md:-mx-3">
          {/* Post 1 */}
          <div className="w-1/3 p-px md:px-3">
            <a href="#" className="group">
              <article className="post relative aspect-square bg-gray-100 text-white md:mb-6">
                <Image
                  alt="post"
                  className="h-full w-full object-cover"
                  src="https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                  width={500}
                  height={500}
                />
                <div className="overlay absolute left-0 top-0 hidden h-full w-full bg-gray-800 bg-opacity-25 md:group-hover:block">
                  <div className="flex h-full items-center justify-center space-x-4">
                    <span className="p-2">
                      <Heart className="mr-1 inline h-5 w-5" />
                      412K
                    </span>
                    <span className="p-2">
                      <MessageCircle className="mr-1 inline h-5 w-5" />
                      2,909
                    </span>
                  </div>
                </div>
              </article>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
