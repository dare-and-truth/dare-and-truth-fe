import { FeedProvider, WebSocketProvider } from '@/app/contexts';
import { UserAppProvider } from '@/app/contexts/UserAppContext';
import NavBar from '@/components/NavBar';
import SidebarLayout from '@/components/SideBarLayout';
import { Slide, ToastContainer } from 'react-toastify';

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UserAppProvider>
        <SidebarLayout>
          <NavBar />
          <WebSocketProvider>
            <FeedProvider>{children}</FeedProvider>
          </WebSocketProvider>
        </SidebarLayout>
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Slide}
        />
      </UserAppProvider>
    </>
  );
}
