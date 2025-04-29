import { Link } from "wouter";
import { programs } from "@/lib/constants";

const Programs = () => {
  return (
    <section id="programs" className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Our Programs</h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Discover our age-appropriate classical education programs designed specifically for homeschooling families at every stage of their journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <div key={program.slug} className="program-card">
              <img 
                src={program.imageUrl} 
                alt={`${program.name} class`} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <span className="inline-block px-3 py-1 text-xs font-semibold text-primary bg-primary-100 rounded-full mb-3">
                  {program.ageRange}
                </span>
                <h3 className="text-xl font-bold text-neutral-800 mb-2">{program.name}</h3>
                <p className="text-neutral-600 mb-4">
                  {program.description}
                </p>
                <div className="flex justify-between items-center">
                  <Link href={`/programs/${program.slug}`} className="text-primary hover:text-primary/90 font-medium text-sm">
                    Learn More
                  </Link>
                  <span className="text-sm text-neutral-500">IHIP Compliant</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="#contact" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 shadow-md transition duration-300"
          >
            Enroll Your Child Today
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Programs;
