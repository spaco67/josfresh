"use client";

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { navigation } from '@/config/dashboard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/login');
  }

  // Find the current navigation item based on pathname
  const currentPage = navigation.find((item) => item.href === pathname)?.name || "Dashboard";

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b flex items-center px-6">
          <h1 className="text-xl font-semibold">
            {currentPage}
          </h1>
        </div>
        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}