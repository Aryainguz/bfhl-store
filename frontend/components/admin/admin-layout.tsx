'use client';

import AdminSidebar from '@/components/admin/admin-sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen overflow-hidden bg-slate-50">
      <div className="hidden md:flex h-full w-64 flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-50">
            <Menu className="h-6 w-6 text-brand-700" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <AdminSidebar />
        </SheetContent>
      </Sheet>

      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
