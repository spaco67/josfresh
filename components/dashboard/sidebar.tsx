"use client";

import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { navigation } from '@/config/dashboard';

// Define role-specific navigation items
const farmerNavigation = navigation.filter(item => 
  ['Dashboard', 'Products', 'Wallet', 'Orders', 'Settings'].includes(item.name)
);

const customerNavigation = navigation.filter(item => 
  ['Dashboard', 'Wallet', 'Orders', 'Settings'].includes(item.name)
);

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Select navigation based on user role
  const roleNavigation = session?.user?.role === 'farmer' 
    ? farmerNavigation 
    : customerNavigation;

  return (
    <div className="w-64 bg-card border-r flex flex-col">
      <div className="h-16 flex items-center px-6 border-b">
        <Logo />
      </div>
      <div className="flex-1 flex flex-col p-4">
        <div className="mb-4 px-4 py-2 bg-muted rounded-lg">
          <p className="text-sm font-medium">{session?.user?.name}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {session?.user?.role}
          </p>
        </div>
        <nav className="space-y-1 flex-1">
          {roleNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.name}
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  <Icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            );
          })}
        </nav>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => signOut()}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
} 