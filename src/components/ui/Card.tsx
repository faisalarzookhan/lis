import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '' }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl ${className}`}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
