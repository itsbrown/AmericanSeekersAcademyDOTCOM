import { useState } from "react";
import { Play, X } from "lucide-react";
import videoThumbnail from "@assets/Screen_Shot_2025-12-15_at_4.00.28_PM_1765832463000.png";

const VideoSection = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section className="py-20 bg-[#1e3a5f]" aria-labelledby="video-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="video-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
            See What Makes Us Different
          </h2>
          <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-white to-[hsl(38,75%,55%)] mb-6"></div>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Watch how American Seekers Academy brings classical education to life for homeschool families.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            {!isVideoPlaying ? (
              <>
                {/* Video Thumbnail with Logo */}
                <div className="relative aspect-video bg-black">
                  <img 
                    src={videoThumbnail}
                    alt="Students raising hands in classroom at American Seekers Academy"
                    className="w-full h-full object-cover"
                  />
                  {/* Play Button Overlay */}
                  <button
                    onClick={() => setIsVideoPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors duration-300 group cursor-pointer"
                    aria-label="Play video"
                    data-testid="video-play-btn"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 h-8 md:w-10 md:h-10 text-[#1e3a5f] ml-1" fill="currentColor" />
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <div className="relative aspect-video bg-black">
                {/* Video Player */}
                <video 
                  className="w-full h-full"
                  controls
                  autoPlay
                  data-testid="video-player"
                >
                  <source src="/promo-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {/* Close Button */}
                <button
                  onClick={() => setIsVideoPlaying(false)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors duration-200"
                  aria-label="Close video"
                  data-testid="video-close-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
