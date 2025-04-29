import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`bg-white ${isScrolled ? 'shadow-md' : ''} fixed w-full z-50 transition-shadow duration-300`}>
      <div className="container-custom">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-montserrat font-bold text-lg sm:text-xl md:text-2xl text-primary">American Seekers Academy</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center">
            <nav className="ml-10 flex items-baseline space-x-4">
              <Link href="/#home" className="text-neutral-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/#programs" className="text-neutral-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Programs
              </Link>
              <Link href="/#curriculum" className="text-neutral-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Curriculum
              </Link>
              <Link href="/#about" className="text-neutral-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                About Us
              </Link>
              <Link href="/#locations" className="text-neutral-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Locations
              </Link>
              <Link href="/#faq" className="text-neutral-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                FAQ
              </Link>
              <Link href="/#contact" className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90">
                Contact Us
              </Link>
            </nav>
          </div>
          
          <div className="flex md:hidden items-center">
            <button 
              type="button" 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-600 hover:text-primary hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <Link href="/#home" onClick={closeMenu} className="text-neutral-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
            Home
          </Link>
          <Link href="/#programs" onClick={closeMenu} className="text-neutral-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
            Programs
          </Link>
          <Link href="/#curriculum" onClick={closeMenu} className="text-neutral-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
            Curriculum
          </Link>
          <Link href="/#about" onClick={closeMenu} className="text-neutral-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
            About Us
          </Link>
          <Link href="/#locations" onClick={closeMenu} className="text-neutral-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
            Locations
          </Link>
          <Link href="/#faq" onClick={closeMenu} className="text-neutral-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
            FAQ
          </Link>
          <Link href="/#contact" onClick={closeMenu} className="mt-3 block w-full px-5 py-3 text-center font-medium text-white bg-primary hover:bg-primary/90 rounded-md">
            Contact Us
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
