import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`w-5 h-5 ${
            index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
          }`}
        />
      ))}
    </div>
  );
};

export default StarRating;
