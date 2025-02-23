import CalendarComponent from '@/components/Calendar';

export default function CalendarPage() {
  return (
    <div className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-7 pb-20 md:pb-4">
      <div className="mx-auto max-w-2xl p-4">
        <CalendarComponent />
      </div>
    </div>
  );
}
