import Loading from '@/components/Loading';

export default function FullScreenLoading({
  isLoading,
}: {
  isLoading: boolean;
}) {
  if (!isLoading) return null; // Không hiển thị nếu không loading

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="flex flex-col items-center">
        <Loading />
      </div>
    </div>
  );
}
