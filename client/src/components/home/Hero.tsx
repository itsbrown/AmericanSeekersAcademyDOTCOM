import { Link } from "wouter";
import { ArrowRight, BookOpen, Star, Users } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 hero-pattern"></div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent"></div>
      
      <div className="container-custom relative z-10">
        <div className="lg:flex lg:items-center lg:justify-between lg:gap-16">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6" data-testid="hero-badge">
              <Star className="h-4 w-4 fill-current" />
              Classical Education Excellence
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Discover the Joy of{" "}
              <span className="text-primary">Classical Learning</span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 text-muted-foreground leading-relaxed">
              American Seekers Academy empowers homeschool families with in-person classical education. We cultivate civic virtue, academic excellence, and lifelong friendships.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link 
                href="#programs" 
                className="btn-primary text-base"
                data-testid="hero-explore-btn"
              >
                Explore Programs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="#contact" 
                className="btn-secondary text-base"
                data-testid="hero-contact-btn"
              >
                Get in Touch
              </Link>
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2" data-testid="hero-stat-ages">
                <Users className="h-5 w-5 text-primary" />
                <span>Ages 6 months - 12th Grade</span>
              </div>
              <div className="flex items-center gap-2" data-testid="hero-stat-education">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>Classical Curriculum</span>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/10 rounded-2xl blur-2xl"></div>
              <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-white/50">
                <img 
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80" 
                  alt="Students engaged in classical education with books and collaborative learning" 
                  className="w-full h-auto object-cover" 
                  style={{ maxHeight: '480px' }}
                  loading="eager"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-card rounded-lg shadow-xl p-4 border border-border/50" data-testid="hero-tagline-card">
                <p className="text-sm font-medium text-primary italic">"Learn Best. Make Friends. Live Well."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
