import React from 'react';
import { Outlet } from 'react-router-dom';
import SimpleSidebar from './SimpleSidebar';
import Topbar from './Topbar';

export default function Layout() {
  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <SimpleSidebar />
        
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
  );
}
