import { CheckCircle, Sparkles } from 'lucide-react';

export default function EndOfFeed({ refreshFeed }: { refreshFeed: () => void }) {
  return (
    <div className="my-8 flex flex-col items-center justify-center rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50 to-white px-4 py-12">
      <div className="relative mb-4">
        <CheckCircle className="h-12 w-12 text-blue-500" strokeWidth={1.5} />
        <Sparkles className="absolute -right-1 -top-1 h-6 w-6 text-amber-400" />
      </div>

      <h3 className="mb-2 text-xl font-bold text-blue-700">
        Yay! You've seen it all
      </h3>

      <p className="max-w-xs text-center text-blue-600/70">
        You've reached the end of your feed. Check back later for more updates!
      </p>

      <div className="mt-6 flex gap-3">
        <button
          className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
          onClick={refreshFeed}
        >
          Refresh Feed
        </button>
      </div>
    </div>
  );
}
