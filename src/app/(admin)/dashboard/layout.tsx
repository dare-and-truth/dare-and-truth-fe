'use client';
import Header from '@/components/Header';
import Loading from '@/components/Loading';
import SideBar from '@/components/SideBar';
import { jwtDecode } from 'jwt-decode';
import { Badge, FileText, Users } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // null: chưa kiểm tra, true: admin, false: không phải admin

  // Hàm giải mã JWT
  const getRoleFromToken = (token: string | null) => {
    if (!token) return null;
    try {
      const payload: any = jwtDecode(token);
      return payload.role;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  };

  // Kiểm tra role ngay lập tức và trong useEffect
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const role = getRoleFromToken(token);

    if (!token || role !== 'admin') {
      setIsAuthorized(false);
      toast.error('You are not an admin. Please log in as an admin.');
      router.push('/auth/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const adminNavItems = [
    {
      icon: <Users size={20} />,
      text: 'Manage Users',
      href: '/dashboard/user',
      active: pathname === '/dashboard/user',
    },
    {
      icon: <FileText size={20} />,
      text: 'Manage Challenges',
      href: '/dashboard/challenge',
      active: pathname === '/dashboard/challenge',
    },
    {
      icon: <FileText size={20} />,
      text: 'Manage Posts',
      href: '/dashboard/post',
      active: pathname === '/dashboard/post',
    },
    {
      icon: <Badge size={20} />,
      text: 'Manage Badges',
      href: '/dashboard/badge',
      active: pathname === '/dashboard/badge',
    },
  ];

  // Nếu chưa kiểm tra xong hoặc không phải admin, không render nội dung chính
  if (isAuthorized === null) {
    return <Loading />; // Hoặc một spinner/loading indicator
  }

  if (!isAuthorized) {
    return null; // Không render gì cả, vì đã điều hướng trong useEffect
  }

  // Chỉ render khi đã xác nhận là admin
  return (
    <div className="flex h-screen overflow-hidden bg-[#F1F5F9]">
      <SideBar navItems={adminNavItems} />
      <div className="flex-1 md:ml-64">
        <Header />
        {children}
      </div>
    </div>
  );
}
