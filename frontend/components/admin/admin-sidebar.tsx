'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    Home,
    LayoutDashboard,
    LogOut,
    Package
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  onClick?: () => void;
}

function SidebarLink({ href, icon: Icon, children, onClick }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  );
}

export default function AdminSidebar() {
  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
  };

  return (
    <div className="h-[100vh] flex flex-col border-r bg-card">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-6 px-2">Admin Dashboard</h2>
        <nav className="space-y-1">
          <SidebarLink href="/admin" icon={LayoutDashboard}>
            Dashboard
          </SidebarLink>
          <SidebarLink href="/admin/orders" icon={Package}>
            Orders
          </SidebarLink>
          <SidebarLink href="/" icon={Home}>
            Home
          </SidebarLink>
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button
          variant="outline"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}
