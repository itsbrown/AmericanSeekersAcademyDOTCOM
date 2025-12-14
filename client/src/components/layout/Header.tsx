import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import logoImage from "@assets/image_1765749931677.png";

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

  const navLinkClass = "text-foreground/80 hover:text-primary px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors duration-200";
  const navLinkMobileClass = "text-foreground/80 hover:text-primary hover:bg-primary/5 block px-4 py-3 rounded-md text-base font-medium cursor-pointer transition-colors duration-200";

  return (
    <header 
      className={`bg-card/95 backdrop-blur-md ${isScrolled ? 'shadow-lg border-b border-border/50' : 'border-b border-transparent'} fixed w-full z-50 transition-all duration-300`}
      role="banner"
    >
      <div className="container-custom">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center" aria-label="American Seekers Academy Home">
              <img src={logoImage} alt="American Seekers Academy" className="h-14 w-auto" />
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center" role="navigation" aria-label="Main navigation">
            <div className="flex items-center space-x-1">
              <a href="#home" onClick={(e) => scrollToSection(e, "#home")} className={navLinkClass} data-testid="nav-home">
                Home
              </a>
              <a href="#programs" onClick={(e) => scrollToSection(e, "#programs")} className={navLinkClass} data-testid="nav-programs">
                Programs
              </a>
              <a href="#curriculum" onClick={(e) => scrollToSection(e, "#curriculum")} className={navLinkClass} data-testid="nav-curriculum">
                Curriculum
              </a>
              <a href="#about" onClick={(e) => scrollToSection(e, "#about")} className={navLinkClass} data-testid="nav-about">
                About Us
              </a>
              <a href="#locations" onClick={(e) => scrollToSection(e, "#locations")} className={navLinkClass} data-testid="nav-locations">
                Locations
              </a>
              <a href="#faq" onClick={(e) => scrollToSection(e, "#faq")} className={navLinkClass} data-testid="nav-faq">
                FAQ
              </a>
              <a 
                href="#contact" 
                onClick={(e) => scrollToSection(e, "#contact")} 
                className="ml-4 btn-accent text-sm py-2 px-5 cursor-pointer" 
                data-testid="nav-contact"
              >
                Contact Us
              </a>
            </div>
          </nav>
          
          <div className="flex md:hidden items-center">
            <button 
              type="button" 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors duration-200"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              data-testid="mobile-menu-button"
            >
              <span className="sr-only">{isMenuOpen ? "Close main menu" : "Open main menu"}</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div 
        id="mobile-menu"
        className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="px-4 pt-2 pb-4 space-y-1 bg-card border-t border-border/50 shadow-xl">
          <a href="#home" onClick={(e) => scrollToSection(e, "#home")} className={navLinkMobileClass}>
            Home
          </a>
          <a href="#programs" onClick={(e) => scrollToSection(e, "#programs")} className={navLinkMobileClass}>
            Programs
          </a>
          <a href="#curriculum" onClick={(e) => scrollToSection(e, "#curriculum")} className={navLinkMobileClass}>
            Curriculum
          </a>
          <a href="#about" onClick={(e) => scrollToSection(e, "#about")} className={navLinkMobileClass}>
            About Us
          </a>
          <a href="#locations" onClick={(e) => scrollToSection(e, "#locations")} className={navLinkMobileClass}>
            Locations
          </a>
          <a href="#faq" onClick={(e) => scrollToSection(e, "#faq")} className={navLinkMobileClass}>
            FAQ
          </a>
          <a 
            href="#contact" 
            onClick={(e) => scrollToSection(e, "#contact")} 
            className="mt-3 block w-full btn-accent text-center py-3 cursor-pointer"
          >
            Contact Us
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
