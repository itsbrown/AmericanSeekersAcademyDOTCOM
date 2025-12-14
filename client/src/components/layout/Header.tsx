import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import logoImage from "@assets/ASA_Logo_2025_landscape_1765749079703.png";

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

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    closeMenu();
    
    if (location !== "/") {
      window.location.href = "/" + sectionId;
      return;
    }
    
    const element = document.getElementById(sectionId.replace("#", ""));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className={`bg-white ${isScrolled ? 'shadow-md' : ''} fixed w-full z-50 transition-shadow duration-300`}>
      <div className="container-custom">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img src={logoImage} alt="American Seekers Academy" className="h-14 w-auto" />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center">
            <nav className="ml-10 flex items-baseline space-x-4">
              <a href="#home" onClick={(e) => scrollToSection(e, "#home")} className="text-neutral-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium cursor-pointer" data-testid="nav-home">
                Home
              </a>
              <a href="#programs" onClick={(e) => scrollToSection(e, "#programs")} className="text-neutral-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium cursor-pointer" data-testid="nav-programs">
                Programs
              </a>
              <a href="#curriculum" onClick={(e) => scrollToSection(e, "#curriculum")} className="text-neutral-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium cursor-pointer" data-testid="nav-curriculum">
                Curriculum
              </a>
              <a href="#about" onClick={(e) => scrollToSection(e, "#about")} className="text-neutral-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium cursor-pointer" data-testid="nav-about">
                About Us
              </a>
              <a href="#locations" onClick={(e) => scrollToSection(e, "#locations")} className="text-neutral-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium cursor-pointer" data-testid="nav-locations">
                Locations
              </a>
              <a href="#faq" onClick={(e) => scrollToSection(e, "#faq")} className="text-neutral-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium cursor-pointer" data-testid="nav-faq">
                FAQ
              </a>
              <a href="#contact" onClick={(e) => scrollToSection(e, "#contact")} className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-accent/90 cursor-pointer" data-testid="nav-contact">
                Contact Us
              </a>
            </nav>
          </div>
          
          <div className="flex md:hidden items-center">
            <button 
              type="button" 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-600 hover:text-primary hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded={isMenuOpen}
              data-testid="mobile-menu-button"
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
          <a href="#home" onClick={(e) => scrollToSection(e, "#home")} className="text-neutral-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium cursor-pointer">
            Home
          </a>
          <a href="#programs" onClick={(e) => scrollToSection(e, "#programs")} className="text-neutral-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium cursor-pointer">
            Programs
          </a>
          <a href="#curriculum" onClick={(e) => scrollToSection(e, "#curriculum")} className="text-neutral-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium cursor-pointer">
            Curriculum
          </a>
          <a href="#about" onClick={(e) => scrollToSection(e, "#about")} className="text-neutral-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium cursor-pointer">
            About Us
          </a>
          <a href="#locations" onClick={(e) => scrollToSection(e, "#locations")} className="text-neutral-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium cursor-pointer">
            Locations
          </a>
          <a href="#faq" onClick={(e) => scrollToSection(e, "#faq")} className="text-neutral-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium cursor-pointer">
            FAQ
          </a>
          <a href="#contact" onClick={(e) => scrollToSection(e, "#contact")} className="mt-3 block w-full px-5 py-3 text-center font-medium text-white bg-accent hover:bg-accent/90 rounded-md cursor-pointer">
            Contact Us
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
