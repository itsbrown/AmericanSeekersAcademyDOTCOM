import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="hero-pattern pt-32 pb-20 md:pb-32">
      <div className="container-custom">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-800 mb-6 leading-tight">
              <span className="text-primary">Classical Education</span> for Modern Homeschool Families
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-neutral-600 leading-relaxed italic">
              "Helping others to find peace in the balance of learning and living, this co-op was created by homeschool parents for all parents who want more."
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="#programs" className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 shadow-md transition duration-300">
                Explore Programs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="#contact" className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-neutral-50 shadow-md transition duration-300">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80" 
              alt="Homeschool family learning together" 
              className="rounded-lg shadow-xl w-full h-auto object-cover" 
              style={{ maxHeight: '500px' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
