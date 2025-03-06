import ProgressMonster from "@/components/ProgressMonster";
import { Check, Link } from "lucide-react";
import Image from "next/image";

export default function ProfileHeader({ userId }: { userId: string }) {
  return (
    <header className="flex flex-wrap items-center p-4 md:py-8">
      <div className="md:ml-16 md:w-3/12">
        <Image
          alt="profile"
          className="h-20 w-20 rounded-full border-2 border-pink-600 object-cover p-1 md:h-40 md:w-40"
          src="https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80"
          width={160}
          height={160}
        />
      </div>

      <div className="ml-4 w-8/12 md:w-7/12">
        <div className="mb-4 md:flex md:flex-wrap md:items-center">
          <h2 className="mb-2 inline-block text-3xl font-light sm:mb-0 md:mr-2">
            Linh Nguyễn
          </h2>
          <span className="relative mr-6 inline-block -translate-y-2 transform text-xl text-blue-500">
            <Check className="absolute inset-x-0 ml-1 mt-1 h-5 w-5 text-white" />
          </span>
          <Link
            href="#"
            className="block rounded bg-blue-500 px-2 py-1 text-center text-sm font-semibold text-white sm:inline-block"
          >
            Edit Profile
          </Link>
        </div>
        <ProgressMonster />
      </div>
    </header>
  );
}
