import { SearchNotFound } from '@/app/types';

function NotFound({ message }: SearchNotFound) {
  return (
    <section className="flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            {message}
          </p>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
