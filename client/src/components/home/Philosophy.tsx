import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

const Philosophy = () => {
  return (
    <section className="py-16 bg-neutral-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Our Educational Philosophy</h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            American Seekers Academy uses inspiration from the Classical model of education, offering a time-tested and complete schooling experience that complements your homeschooling journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-center mb-4">
              <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary">
                <i className="fas fa-book text-2xl"></i>
              </span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-800 mb-3 text-center">Classical Model</h3>
            <p className="text-neutral-600">
              The Trivium and Quadrivium provide a basis for core subjects taught throughout the week, creating a well-rounded educational foundation.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-center mb-4">
              <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary">
                <i className="fas fa-users text-2xl"></i>
              </span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-800 mb-3 text-center">Parent-Driven</h3>
            <p className="text-neutral-600">
              Created by homeschool parents for homeschool parents who want more for their children's education while maintaining educational freedom.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-center mb-4">
              <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary">
                <i className="fas fa-flag-usa text-2xl"></i>
              </span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-800 mb-3 text-center">American Values</h3>
            <p className="text-neutral-600">
              Our curriculum emphasizes civic virtue, responsible citizenship, and a deep understanding of American history and values.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="#about" className="inline-flex items-center text-primary hover:text-primary/90 font-medium">
            Learn more about our approach
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
