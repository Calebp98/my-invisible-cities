import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AmarinaImage from '../assets/images/amarina.webp';
import SerafinaImage from '../assets/images/serafina.webp';
import ChrysopolisImage from '../assets/images/chrysopolis.webp';
import MeroveaImage from '../assets/images/merovea.webp';

const cities = [
  {
    name: "Amarina",
    text: `In Amarina, all houses face inward. Visitors stumbling upon the city see only windowless walls of weathered stone, arranged in concentric circles that spiral toward the center. The inhabitants insist this design arose from necessity - in the age of great winds, they say, only inward-facing homes could withstand the gales. But the winds ceased generations ago, and still the people of Amarina build each new structure with its back to the world, its windows and doors opening only onto interior courtyards and covered passages that lead, inevitably, toward the city's heart.

Those who dwell in the outermost ring claim they can hear music drifting from the center, though none can agree on its nature - some speak of bells, others of strings, still others of voices raised in song. The residents of the middle rings report no music, but instead describe the scent of gardens they have never seen. And those few who live in the innermost circle say nothing at all about what lies at the center, changing the subject when asked, though visitors note they seem to walk with an air of perpetual anticipation, as if always on the verge of witnessing something remarkable.`,
    image: AmarinaImage
  },
  {
    name: "Serafina",
    text: `In Serafina, time moves at different speeds in different quarters. The western district races forward so quickly that buildings rise and crumble in the space of a week, while in the eastern quarter, a single sunset has been slowly bleeding into night for the past decade. The city's inhabitants have adapted to these temporal variations with remarkable ingenuity. Merchants in the swift-moving west construct their shops from paper and bamboo, knowing anything more permanent would be a waste. Meanwhile, the eastern residents have learned to speak in glacially slow tones that stretch single syllables across days.

The central market, where all temporal streams meet and mingle, requires the most delicate navigation. Vendors must carefully position their stalls along the gradient between fast and slow time. Those selling perishables cluster toward the swifter west, while dealers in antiques and heirlooms establish themselves in the slower east. The most skilled merchants can balance their wares precisely on the temporal boundaries, so that fresh bread remains warm for weeks while wine ages to perfection in minutes.`,
    image: SerafinaImage
  },
  {
    name: "Chrysopolis",
    text: `In Chrysopolis, memory takes physical form. Each significant moment in the city's history manifests as a crystalline growth that sprouts from walls and streets. Joy forms delicate spires of rose quartz, while moments of collective grief create deep pools of obsidian. The inhabitants have learned to read these mineral memories like a language, teaching their children to distinguish between the milky selenite of first loves and the sharp amethyst of hard-won victories.

The city's archives are not kept in books but in vast geological gardens where historians tend to the growing crystals, carefully pruning away false memories (recognized by their hollow centers) and protecting the most precious recollections from erosion. The oldest memories, those from the city's founding, have grown so large and complex that they have become entire buildings, their faceted halls refracting ancient light. Some say that if you stand in the right spot within these crystal palaces, you can catch glimpses of the city's future, glinting darkly in the countless mirrored surfaces.

Each new generation adds its own layer of crystalline memories to the city's architecture, until the line between building and memory, between infrastructure and history, becomes impossible to distinguish. Visitors often ask what will happen when the weight of accumulated memories grows too heavy for the city to bear. The inhabitants of Chrysopolis only smile and point to the network of deep fissures that run beneath the city - channels carved by the slow dissolution of painful memories, making space for new joys to crystallize.`,
    image: ChrysopolisImage
  },
//   {
//     name: "Merovea",
//     text: `In Merovea, cartographers are revered above all other professions, for the city refuses to maintain a constant shape. Streets that run north to south on Mondays flow east to west by Wednesday. Bridges span different rivers each week, and the grand cathedral has been known to swap places with the public gardens when no one is looking. The city's inhabitants navigate by consulting an ever-changing array of maps, each valid for no more than a day, hand-drawn by the cartographers who work in shifts to document the city's perpetual transformations.

// The most skilled cartographers can predict the city's next configuration by studying the subtle tensions in its current layout - the way certain buildings lean toward each other, the patterns of cracks in the cobblestones, the direction the weathervanes point even in still air. These predictions are never perfect, but they help the city's residents prepare for the next metamorphosis, moving their belongings and adjusting their commutes accordingly.

// Some claim that Merovea's restlessness began centuries ago when a powerful magician tried to capture the city's true essence in a single, eternal map. The city, offended by this attempt to fix its nature, resolved never again to be perfectly describable. Others say the shifting is natural, that all cities secretly wish to rearrange themselves, and Merovea is simply the only one brave enough to do so. Whatever the truth, the city's cartographers continue their endless work, knowing that each map they create will be obsolete by sunrise, but understanding that it is the act of description itself, not its permanence, that gives their work meaning.`,
//     image: MeroveaImage
//   }
];

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

  useEffect(() => {
    // Shuffle cities when the component mounts
    setShuffledCities(shuffleArray([...cities]));
  }, []);

  // Ensure that we always render something
  const currentCity = shuffledCities[currentIndex];

  const [isTransitioning, setIsTransitioning] = useState(false);

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
                    <p key={idx} className="mb-6 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <img 
                  src={currentCity.image} 
                  alt={currentCity.name} 
                  className={`mt-6 w-full h-auto ${imageLoaded ? 'block' : 'hidden'}`} 
                  onLoad={() => setImageLoaded(true)}
                />
              </>
            ) : (
              <div>Loading...</div> // Loading state while cities are being shuffled
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
              {currentIndex + 1} / {cities.length}
            </div>
            <button
              onClick={goToNext}
              disabled={currentIndex === cities.length - 1}
              className={`p-2 rounded-full ${currentIndex === cities.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityViewer;