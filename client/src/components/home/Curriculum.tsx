import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { curriculumSubjects, trustedSources, curriculumTabs } from '@/lib/constants';

const Curriculum = () => {
  const [activeTab, setActiveTab] = useState(curriculumTabs[0].id);

  const activeTabContent = curriculumTabs.find(tab => tab.id === activeTab);

  return (
    <section id="curriculum" className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Our Comprehensive Curriculum</h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            We formulate our curricula and lesson plans based on reputable and vetted sources to provide a well-rounded classical education.
          </p>
        </div>
        
        <div className="md:flex md:space-x-8">
          <div className="md:w-1/3">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold text-neutral-800 mb-2">Core Subjects</h3>
                <ul className="space-y-3 text-neutral-600">
                  {curriculumSubjects.map((subject, index) => (
                    <li key={index} className="flex items-center">
                      <i className={`fas ${subject.icon} text-secondary mr-2`}></i>
                      {subject.name}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral-800 mb-2">Trusted Sources</h3>
                <ul className="space-y-3 text-neutral-600">
                  {trustedSources.map((source, index) => (
                    <li key={index} className="flex items-center">
                      <i className={`fas ${source.icon} text-primary mr-2`}></i>
                      {source.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3 mt-8 md:mt-0">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="border-b border-neutral-200">
                <nav className="flex -mb-px" aria-label="Tabs">
                  {curriculumTabs.map((tab) => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium ${
                        activeTab === tab.id 
                          ? 'border-primary text-primary' 
                          : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
              
              {activeTabContent && (
                <div className="p-6">
                  <h3 className="text-xl font-bold text-neutral-800 mb-4">{activeTabContent.title}</h3>
                  <p className="text-neutral-600 mb-6">
                    {activeTabContent.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {activeTabContent.features.map((feature, index) => (
                      <div key={index} className="bg-neutral-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-neutral-800 mb-2">{feature.title}</h4>
                        <p className="text-neutral-600 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center">
                    <a href="#" className="inline-flex items-center text-primary hover:text-primary/90 font-medium">
                      See detailed curriculum by age group
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Curriculum;
