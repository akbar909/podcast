import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType: 'guest' | 'host';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }
  
  // User type doesn't match required type
  if (user.userType !== userType) {
    // Redirect guest to guest dashboard
    if (user.userType === 'guest') {
      return <Navigate to="/guest" />;
    }
    
    // Redirect host to host dashboard
    if (user.userType === 'host') {
      return <Navigate to="/host" />;
    }
  }
  
  // User is authenticated and has correct type
  return <>{children}</>;
};

export default ProtectedRoute;