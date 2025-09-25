import React from 'react';
import { Outlet } from 'react-router-dom';
import CompactSidebar from './CompactSidebar';
import Topbar from './Topbar';
import { SidebarProvider } from './ui/sidebar';

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        {/* Sidebar */}
        <CompactSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Topbar />
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
