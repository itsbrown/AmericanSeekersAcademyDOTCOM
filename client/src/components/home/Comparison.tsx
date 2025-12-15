import { programs } from '@/lib/constants';
import { ChevronRight } from 'lucide-react';

const Comparison = () => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId.replace("#", ""));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Program Comparison</h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Compare our age-appropriate programs to find the perfect fit for your child's educational journey.
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-primary text-white">
              <tr>
                <th className="py-4 px-6 text-left">Program</th>
                <th className="py-4 px-6 text-left">Ages/Grades</th>
                <th className="py-4 px-6 text-left">Key Focus Areas</th>
                <th className="py-4 px-6 text-left">Teaching Methods</th>
                <th className="py-4 px-6 text-left">IHIP Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {programs.map((program) => (
                <tr key={program.slug} className="hover:bg-neutral-50">
                  <td className="py-4 px-6 font-medium">{program.name}</td>
                  <td className="py-4 px-6">{program.ageRange}</td>
                  <td className="py-4 px-6">{program.keyFocus.join(', ')}</td>
                  <td className="py-4 px-6">{program.teachingMethods.join(', ')}</td>
                  <td className="py-4 px-6">
                    <i className="fas fa-check text-secondary"></i> {program.ihipHours}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 text-center">
          <a 
            href="#programs" 
            onClick={(e) => scrollToSection(e, "#programs")}
            className="inline-flex items-center text-primary hover:text-primary/90 font-medium cursor-pointer"
            data-testid="link-view-programs"
          >
            View detailed program information
            <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
