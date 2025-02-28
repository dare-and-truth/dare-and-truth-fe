import { MainSideBar } from '@/components/MainSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function SidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '280px',
        } as React.CSSProperties
      }
    >
      <MainSideBar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
