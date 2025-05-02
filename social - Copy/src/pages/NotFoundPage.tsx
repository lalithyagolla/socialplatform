import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-orange-500">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-800">Page Not Found</h2>
        <p className="mt-2 text-lg text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-3 bg-orange-500 text-white rounded-lg flex items-center space-x-2 hover:bg-orange-600 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/feed"
            className="px-6 py-3 border border-orange-500 text-orange-500 rounded-lg flex items-center space-x-2 hover:bg-orange-50 transition-colors"
          >
            <Search className="h-5 w-5" />
            <span>Explore Content</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;