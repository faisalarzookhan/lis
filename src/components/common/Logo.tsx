import React from 'react';
import Link from 'next/link';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Link href="/" className={`flex items-center space-x-3 ${className}`}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4H20V12H12V36H20V44H4V4Z" fill="url(#paint0_linear_1_2)"/>
        <path d="M28 4H44V44H28V36H36V12H28V4Z" fill="url(#paint1_linear_1_2)"/>
        <defs>
          <linearGradient id="paint0_linear_1_2" x1="4" y1="24" x2="20" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2A52BE"/>
            <stop offset="1" stopColor="#1E3A8A"/>
          </linearGradient>
          <linearGradient id="paint1_linear_1_2" x1="28" y1="24" x2="44" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F97316"/>
            <stop offset="1" stopColor="#EA580C"/>
          </linearGradient>
        </defs>
      </svg>
      <div className="hidden sm:block">
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          Limitless Infotech
        </span>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Where Innovation Meets Execution
        </div>
      </div>
    </Link>
  );
};

export default Logo;
