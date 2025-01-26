import { MobileMenu } from '@/components/MobileMenu';
import { UserDropdown } from '@/components/UserDropdown';
import Image from 'next/image';

export default function Header() {
  return (
    <div className="fixed left-0 right-0 top-0 z-10 flex h-16 items-center justify-between bg-white p-3 shadow-sm md:left-64">
      <div className="flex md:hidden">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={80}
          height={32}
          className="w-20"
        />
      </div>

      <div className="hidden max-w-4xl flex-1 items-center rounded-lg bg-gray-50 px-4 py-2 md:flex">
        <div className="sm:hidden md:block md:w-40 lg:block lg:w-56">
          <p>Hi, Lam Nhat</p>
          <p>Welcome Back!</p>
        </div>
        <div className="relative w-full sm:hidden md:block lg:block">
          <input
            className="w-full rounded-md border-2 border-gray-200 px-3 py-2 pl-10 leading-tight text-black transition-colors hover:border-gray-200 focus:outline-none"
            id="search"
            type="text"
            placeholder="Search..."
            aria-label="Search"
          />
          <div className="absolute inset-y-0 left-0 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-3 h-6 w-6 text-gray-400 hover:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <MobileMenu />
        <UserDropdown />
      </div>
    </div>
  );
}
