import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Sidebar from '../components/navigation/Sidebar';

interface MainLayoutProps {
  userType: 'guest' | 'host';
}

const MainLayout: React.FC<MainLayoutProps> = ({ userType }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar userType={userType} />
      
      <div className="flex flex-1">
        <Sidebar userType={userType} />
        
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;