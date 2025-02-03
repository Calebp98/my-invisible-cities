import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import citiesData from '../data/cities.json';

// Dynamically import all webp files from the images directory
const images = import.meta.glob('../assets/images/*.webp', { eager: true });

// Create image map from the dynamic imports
const imageMap = Object.fromEntries(
  Object.entries(images).map(([path, module]) => [
    path.split('/').pop(), // Get just the filename
    module.default
  ])
);

const cities = citiesData; // Use citiesData directly

const CityViewer = () => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cityName = urlParams.get('city');
    
    if (cityName) {
      const index = cities.findIndex(city => 
        city.name.toLowerCase() === cityName.toLowerCase()
      );
      return index !== -1 ? index : Math.floor(Math.random() * cities.length);
    }
    return Math.floor(Math.random() * cities.length);
  });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Add touch handling for swipe navigation
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Swipe handling
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrevious();

    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex]);

  useEffect(() => {
    const currentCity = cities[currentIndex];
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('city', currentCity.name);
    window.history.pushState({}, '', newUrl);
  }, [currentIndex]);

  const currentCity = cities[currentIndex];

  const goToNext = () => {
    if (currentIndex < cities.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setImageLoaded(false);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setImageLoaded(false);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-8"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
      <div className="mt-6 h-64 bg-gray-200 rounded"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div 
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-label="City viewer navigation"
        >
          <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {currentCity ? (
              <>
                <h1 className="text-4xl font-serif mb-8 text-gray-900">{currentCity.name}</h1>
                <div className="relative md:float-right md:ml-8 md:w-1/2 mb-6">
                  {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
                  )}
                  <img 
                    src={imageMap[currentCity.image]} 
                    alt={`Illustration of ${currentCity.name}`}
                    className={`w-full h-auto rounded-lg shadow-lg transition-opacity duration-300 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                  />
                  {imageError && (
                    <div className="mt-6 p-4 text-center text-red-600 bg-red-50 rounded">
                      Failed to load image
                    </div>
                  )}
                </div>
                <div className="prose prose-lg">
                  {currentCity.text.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-6 text-gray-700 leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </>
            ) : (
              <LoadingSkeleton />
            )}
          </div>

          <div className="flex justify-between items-center mt-12">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className={`p-2 rounded-full ${currentIndex === 0 ? 'text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
              aria-label="Previous city"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="text-sm text-gray-500">
              {currentIndex + 1} / {cities.length}
            </div>
            <button
              onClick={goToNext}
              disabled={currentIndex === cities.length - 1}
              className={`p-2 rounded-full ${currentIndex === cities.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
              aria-label="Next city"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
      <div className="text-right italic text-gray-500 mt-4">
        <p>Use arrow keys or swipe to navigate • Inspired by <a href="https://en.wikipedia.org/wiki/Invisible_Cities" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">Italo Calvino's "Invisible Cities"</a></p>
      </div>
    </div>
  );
};

export default CityViewer;