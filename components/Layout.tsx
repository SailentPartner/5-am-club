import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <div className="min-h-[100dvh] w-full flex justify-center bg-gray-100">
      <div className={`w-full max-w-md bg-white shadow-xl min-h-[100dvh] relative flex flex-col safe-bottom ${className}`}>
        {children}
      </div>
    </div>
  );
};