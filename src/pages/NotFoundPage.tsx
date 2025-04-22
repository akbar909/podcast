import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <Mic className="w-16 h-16 text-purple-600 mb-6" />
      
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">Page Not Found</h1>
      <p className="text-lg text-gray-600 max-w-md text-center mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <Link 
        to="/" 
        className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
      >
        <Home className="w-5 h-5 mr-2" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;