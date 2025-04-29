import React from 'react';
import { locations } from '@/lib/constants';
import LocationForm from '../common/LocationForm';

const Locations = () => {
  return (
    <section id="locations" className="py-16 bg-neutral-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Our Locations</h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            American Seekers Academy is growing to serve more homeschool families. Find a location near you or suggest a new one.
          </p>
        </div>
        
        <div className="md:flex md:space-x-8">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h3 className="text-xl font-bold text-neutral-800 mb-2">Current Locations</h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {locations.map((location, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4">
                        <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-100 text-primary">
                          <i className="fas fa-map-marker-alt"></i>
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-800">{location.name}</h4>
                        <p className="text-neutral-600">{location.address}</p>
                        <p className="text-sm text-neutral-500 mt-1">{location.hours}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h3 className="text-xl font-bold text-neutral-800 mb-2">Suggest a New Location</h3>
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
