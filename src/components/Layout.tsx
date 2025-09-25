import React from 'react';
import { Outlet } from 'react-router-dom';
import MaterialSidebar from './MaterialSidebar';
import Topbar from './Topbar';

export default function Layout() {
  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <MaterialSidebar />
        
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
