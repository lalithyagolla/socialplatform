import React from 'react';

const FeedSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-3 w-32 bg-gray-200 rounded mt-2"></div>
            </div>
          </div>
          <div className="h-5 w-5 bg-gray-200 rounded"></div>
        </div>
        
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
        
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
        </div>
        
        <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
        
        <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
            <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default FeedSkeleton;