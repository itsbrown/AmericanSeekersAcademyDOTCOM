import { useState } from 'react';
import { ChevronRight, BookOpen, GraduationCap } from 'lucide-react';
import { curriculumSubjects, trustedSources, curriculumTabs } from '@/lib/constants';

const Curriculum = () => {
  const [activeTab, setActiveTab] = useState(curriculumTabs[0].id);

  const activeTabContent = curriculumTabs.find(tab => tab.id === activeTab);

  return (
    <section id="curriculum" className="py-20 bg-muted/50" aria-labelledby="curriculum-heading">
      <div className="container-custom">
        <div className="text-center mb-14">
          <h2 id="curriculum-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Comprehensive Curriculum</h2>
          <div className="section-divider mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We formulate our curricula and lesson plans based on reputable and vetted sources to provide a well-rounded classical education.
          </p>
        </div>
        
        <div className="md:flex md:gap-8">
          <div className="md:w-1/3">
            <div className="card-elegant overflow-hidden">
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-secondary/10 text-secondary">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <h3 className="text-xl font-bold text-foreground">Core Subjects</h3>
                </div>
                <ul className="space-y-3 text-muted-foreground" role="list">
                  {curriculumSubjects.map((subject, index) => (
                    <li key={index} className="flex items-center" data-testid={`subject-${index}`}>
                      <span className="h-2 w-2 rounded-full bg-secondary mr-3"></span>
                      {subject.name}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <h3 className="text-xl font-bold text-foreground">Trusted Sources</h3>
                </div>
                <ul className="space-y-3 text-muted-foreground" role="list">
                  {trustedSources.map((source, index) => (
                    <li key={index} className="flex items-center" data-testid={`source-${index}`}>
                      <span className="h-2 w-2 rounded-full bg-primary mr-3"></span>
                      {source.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3 mt-8 md:mt-0">
            <div className="card-elegant overflow-hidden">
              <div className="border-b border-border/50">
                <nav className="flex" aria-label="Curriculum stages" role="tablist">
                  {curriculumTabs.map((tab) => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      className={`flex-1 py-4 px-2 text-center border-b-2 font-medium transition-colors duration-200 ${
                        activeTab === tab.id 
                          ? 'border-primary text-primary bg-primary/5' 
                          : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                      data-testid={`curriculum-tab-${tab.id}`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
              
              {activeTabContent && (
                <div className="p-6" role="tabpanel">
                  <h3 className="text-xl font-bold text-foreground mb-4">{activeTabContent.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {activeTabContent.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {activeTabContent.features.map((feature, index) => (
                      <div key={index} className="bg-muted/50 p-4 rounded-lg border border-border/30" data-testid={`feature-${index}`}>
                        <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center">
                    <a href="#" className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors duration-200" data-testid="curriculum-details-link">
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
