import { locations } from '@/lib/constants';
import LocationForm from '../common/LocationForm';
import { MapPin, Clock, Building2 } from 'lucide-react';

const Locations = () => {
  return (
    <section id="locations" className="py-20 bg-muted/50" aria-labelledby="locations-heading">
      <div className="container-custom">
        <div className="text-center mb-14">
          <h2 id="locations-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Locations</h2>
          <div className="section-divider mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            American Seekers Academy is growing to serve more homeschool families. Find a location near you or suggest a new one.
          </p>
        </div>
        
        <div className="md:flex md:gap-8">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="card-elegant overflow-hidden h-full">
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <h3 className="text-xl font-bold text-foreground">Current Locations</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {locations.map((location, index) => (
                    <div 
                      key={index} 
                      className="flex p-4 rounded-lg bg-muted/30 border border-border/30"
                      data-testid={`location-${index}`}
                    >
                      <div className="mr-4">
                        <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary">
                          <MapPin className="h-6 w-6" />
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">{location.name}</h4>
                        <p className="text-muted-foreground text-sm mb-2">{location.address}</p>
                        <p className="inline-flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          {location.hours}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="card-elegant overflow-hidden h-full">
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-accent/10 text-accent">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <h3 className="text-xl font-bold text-foreground">Suggest a New Location</h3>
                </div>
              </div>
              <div className="p-6">
                <LocationForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Locations;
