import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'danger' }> = ({ 
  className = '', 
  variant = 'primary', 
  ...props 
}) => {
  const baseStyles = "w-full py-4 rounded-xl font-bold tracking-wide transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 uppercase text-sm";
  const variants = {
    // Primary: Yellow background, Black text (High Contrast)
    primary: "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20 hover:bg-yellow-500 border border-yellow-400",
    // Secondary: Black background, White text
    secondary: "bg-gray-900 text-white shadow-lg shadow-gray-900/20 hover:bg-black",
    // Outline: Border only
    outline: "border-2 border-gray-200 text-gray-900 hover:border-black hover:bg-gray-50",
    // Danger: Subtle red
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { dark?: boolean }> = ({ className = '', dark = false, ...props }) => {
  // Split styles to avoid conflict between default 'focus:bg-white' and custom dark styles
  const themeStyles = dark
    ? "bg-gray-800 border-gray-700 text-white focus:border-yellow-400 focus:bg-gray-800 placeholder:text-gray-500"
    : "bg-gray-50 border-gray-100 text-gray-900 focus:border-yellow-400 focus:bg-white placeholder:text-gray-400";

  return (
    <input 
      className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all font-medium ${themeStyles} ${className}`} 
      {...props} 
    />
  );
};

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }> = ({ children, className = '', ...props }) => (
  <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm ${className}`} {...props}>
    {children}
  </div>
);