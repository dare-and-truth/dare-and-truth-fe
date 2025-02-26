export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-blue-50">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200" />
        <div className="absolute left-0 top-0 h-16 w-16 animate-spin rounded-full border-t-4 border-blue-500" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-4 animate-pulse rounded-full bg-blue-500" />
        </div>
      </div>
    </div>
  );
};

