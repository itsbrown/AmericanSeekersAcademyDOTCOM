import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container-custom">
        <div className="md:flex md:items-center md:space-x-12">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <img 
              src="https://images.unsplash.com/photo-1588075592446-265bad1d8506?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="American Seekers Academy mission" 
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
          <div className="md:w-1/2">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-primary bg-primary-100 rounded-full mb-3">Our Mission</span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-6">Cultivating Civic Virtue</h2>
            <p className="text-lg text-neutral-600 mb-6">
              We aim to provide homeschool families access to a private, in-person classical education that guarantees parents' right to choose what is best for their child. Our drop-off program helps make homeschooling a success for the whole family and cultivates civic virtue while preparing students for a life of freedom and intellectual growth.
            </p>
            <p className="text-lg text-neutral-600 mb-6">
              American Seekers Academy was designed by homeschool parents who needed more than the average co-op could provide. We welcome anyone to study here regardless of their faith tradition, political affiliation, or personal ideologies.
            </p>
            <p className="text-lg font-semibold text-neutral-800 italic">
              "Helping others to find peace in the balance of learning and living, this co-op was created by homeschool parents for all parents who want more."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
