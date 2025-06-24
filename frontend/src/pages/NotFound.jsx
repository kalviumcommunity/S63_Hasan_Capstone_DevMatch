import React from 'react';

function NotFound() {
  return (
    <div className="not-found-page flex flex-col items-center justify-center h-screen p-4">
      <h2 className="text-3xl font-semibold text-center">404 - Page Not Found</h2>
      <p className="text-lg text-center text-gray-600">The page you're looking for doesn't exist or has been moved.</p>
      <a href="/" className="mt-4 text-blue-500 hover:underline">Go to Home</a>
    </div>
  );
}

export default NotFound;