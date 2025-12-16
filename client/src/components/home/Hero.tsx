import { ArrowRight, BookOpen, Users } from "lucide-react";
import classroomImage from "@assets/PXL_20250908_131653431_1765832046382.jpg";

const Hero = () => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId.replace("#", ""));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Full-width Background Image - Hillsdale Style */}
      <div className="absolute inset-0">
        <img 
          src={classroomImage}
          alt="Students engaged in classroom learning at American Seekers Academy" 
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/90 via-[#1e3a5f]/70 to-[#1e3a5f]/40"></div>
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 w-full pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-28 md:py-24 md:pb-24">
          <div className="max-w-2xl">
            {/* Tagline */}
            <p className="text-white/90 text-lg md:text-xl font-medium mb-4 tracking-wide" data-testid="hero-tagline">
              Making homeschooling a success for the whole family
            </p>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Classical Education.{" "}
              <span className="text-[hsl(38,75%,55%)]">American Values.</span>
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed max-w-xl">
              We cultivate civic virtue, academic excellence, and lifelong friendships through in-person classical education for homeschool families.
            </p>
            
            {/* Stats Row */}
            <div className="flex flex-wrap gap-6 text-sm text-white/80 mb-10">
              <div className="flex items-center gap-2" data-testid="hero-stat-ages">
                <Users className="h-5 w-5 text-[hsl(38,75%,55%)]" />
                <span>Ages 6 months - 12th Grade</span>
              </div>
              <div className="flex items-center gap-2" data-testid="hero-stat-education">
                <BookOpen className="h-5 w-5 text-[hsl(38,75%,55%)]" />
                <span>Classical Curriculum</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <a 
                href="https://accounts.americanseekersacademy.com/register/2OSQEAY3"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[hsl(38,75%,45%)] hover:bg-[hsl(38,75%,40%)] text-white px-10 py-5 text-lg font-bold rounded-lg shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl"
                data-testid="hero-register-btn"
              >
                Register Now
                <ArrowRight className="ml-2 h-6 w-6" />
              </a>
              <a 
                href="#programs" 
                onClick={(e) => scrollToSection(e, "#programs")}
                className="inline-flex items-center justify-center border-2 border-white/70 text-white/90 hover:bg-white hover:text-[#1e3a5f] px-6 py-3 text-sm font-medium rounded transition-all duration-300 cursor-pointer"
                data-testid="hero-explore-btn"
              >
                Explore Programs
              </a>
              <a 
                href="#contact" 
                onClick={(e) => scrollToSection(e, "#contact")}
                className="inline-flex items-center justify-center border-2 border-white/70 text-white/90 hover:bg-white hover:text-[#1e3a5f] px-6 py-3 text-sm font-medium rounded transition-all duration-300 cursor-pointer"
                data-testid="hero-contact-btn"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Quote Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#1e3a5f]/95 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-white/90 text-xl md:text-2xl font-medium italic" data-testid="hero-quote">
            "Learn Better. Make Friends. Live Well."
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
