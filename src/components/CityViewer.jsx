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

// Function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const CityViewer = () => {
  const [shuffledCities, setShuffledCities] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Get city name from URL if it exists
    const urlParams = new URLSearchParams(window.location.search);
    const cityName = urlParams.get('city');
    
    const shuffled = shuffleArray([...cities]);
    setShuffledCities(shuffled);

    // If we have a city name in the URL, find its index
    if (cityName) {
      const index = shuffled.findIndex(city => 
        city.name.toLowerCase() === cityName.toLowerCase()
      );
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, []);

  // Update URL when current city changes
  useEffect(() => {
    if (shuffledCities.length > 0) {
      const currentCity = shuffledCities[currentIndex];
      const newUrl = new URL(window.location);
      newUrl.searchParams.set('city', currentCity.name);
      window.history.pushState({}, '', newUrl);
    }
  }, [currentIndex, shuffledCities]);

  const currentCity = shuffledCities[currentIndex];

  const goToNext = () => {
    if (currentIndex < shuffledCities.length - 1) {
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="relative overflow-hidden">
          <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {currentCity ? (
              <>
                <h1 className="text-4xl font-serif mb-8 text-gray-900">{currentCity.name}</h1>
                <div className="prose prose-lg">
                  {currentCity.text.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-6 text-gray-700 leading-relaxed">{paragraph}</p>
                  ))}
                </div>
                <img 
                  src={imageMap[currentCity.image]} 
                  alt={currentCity.name} 
                  className={`mt-6 w-full h-auto ${imageLoaded ? 'block' : 'hidden'}`} 
                  onLoad={() => setImageLoaded(true)}
                />
              </>
            ) : (
              <div>Loading...</div>
            )}
          </div>

          <div className="flex justify-between items-center mt-12">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className={`p-2 rounded-full ${currentIndex === 0 ? 'text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <ChevronLeft size={24} />
            </button>
            <div className="text-sm text-gray-500">
              {currentIndex + 1} / {shuffledCities.length}
            </div>
            <button
              onClick={goToNext}
              disabled={currentIndex === shuffledCities.length - 1}
              className={`p-2 rounded-full ${currentIndex === shuffledCities.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
      <div className="text-right italic text-gray-500 mt-4">
        Inspired by Italo Calvino's "Invisible Cities".
      </div>
    </div>
  );
};

export default CityViewer;