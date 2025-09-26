import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { useLazyImage } from '../../hooks/useLazyImage';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  priority?: boolean;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo=',
  priority = false,
  quality = 75,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { src: lazySrc, isInView, imgRef } = useLazyImage(src, {
    threshold: 0.1,
    rootMargin: '50px',
  });

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  if (hasError) {
    return (
      <div
        ref={imgRef as React.RefObject<HTMLDivElement>}
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm ${className}`}
        style={{ width, height }}
      >
        Failed to load image
      </div>
    );
  }

  return (
    <div ref={imgRef as React.RefObject<HTMLDivElement>} className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
          style={{ width, height }}
        />
      )}

      {isInView && (
        <Image
          src={lazySrc}
          alt={alt}
          width={width}
          height={height}
          quality={quality}
          priority={priority}
          placeholder="blur"
          blurDataURL={placeholder}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          style={{
            width: width || 'auto',
            height: height || 'auto',
          }}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
