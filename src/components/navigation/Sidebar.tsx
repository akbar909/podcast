import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, Calendar, MessageSquare, FileText } from 'lucide-react';

interface SidebarProps {
  userType: 'guest' | 'host';
}

const Sidebar: React.FC<SidebarProps> = ({ userType }) => {
  // Different navigation items based on user type
  const navItems = userType === 'guest' 
    ? [
        { to: '/guest', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
        { to: '/guest/requests', icon: <MessageSquare className="w-5 h-5" />, label: 'My Requests' },
        { to: '/guest/profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
      ]
    : [
        { to: '/host', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
        { to: '/host/availability', icon: <Calendar className="w-5 h-5" />, label: 'Availability' },
        { to: '/host/profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
      ];

  return (
    <aside className="hidden md:block w-64 bg-white border-r min-h-full">
      <div className="p-6">
        <div className="font-medium text-lg text-gray-800 mb-6">
          {userType === 'guest' ? 'Guest Portal' : 'Host Portal'}
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                  isActive
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
              end={item.to === '/guest' || item.to === '/host'}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;