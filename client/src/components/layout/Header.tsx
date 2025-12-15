import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import logoImage from "@assets/ASA_Logos-transparent-white&red_1765765829361.png";

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

  const navLinks = [
    { href: "#home", label: "Home", testId: "nav-home" },
    { href: "#programs", label: "Programs", testId: "nav-programs" },
    { href: "#curriculum", label: "Curriculum", testId: "nav-curriculum" },
    { href: "#about", label: "About", testId: "nav-about" },
    { href: "#locations", label: "Locations", testId: "nav-locations" },
    { href: "#faq", label: "FAQ", testId: "nav-faq" },
  ];

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#1e3a5f] shadow-lg' 
          : 'bg-[#1e3a5f]'
      }`}
      role="banner"
    >
      {/* Main Header Bar - White House Style */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Left Side */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center" aria-label="American Seekers Academy Home">
              <img 
                src={logoImage} 
                alt="American Seekers Academy" 
                className="h-10 md:h-12 w-auto" 
              />
            </Link>
          </div>
          
          {/* Desktop Navigation - Right Side */}
          <nav className="hidden lg:flex items-center" role="navigation" aria-label="Main navigation">
            <ul className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    onClick={(e) => scrollToSection(e, link.href)} 
                    className="text-white/90 hover:text-white px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors duration-200 cursor-pointer"
                    data-testid={link.testId}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a 
                  href="#contact" 
                  onClick={(e) => scrollToSection(e, "#contact")} 
                  className="ml-4 bg-white text-[#1e3a5f] hover:bg-gray-100 px-5 py-2 text-sm font-semibold tracking-wide uppercase rounded transition-colors duration-200 cursor-pointer" 
                  data-testid="nav-contact"
                >
                  Contact
                </a>
              </li>
              <li>
                <a 
                  href="https://accounts.americanseekersacademy.com/register/2OSQEAY3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 bg-[hsl(38,75%,45%)] hover:bg-[hsl(38,75%,40%)] text-white px-5 py-2 text-sm font-semibold tracking-wide uppercase rounded transition-colors duration-200 cursor-pointer" 
                  data-testid="nav-register"
                >
                  Register
                </a>
              </li>
            </ul>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button 
              type="button" 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white/80 hover:bg-white/10 transition-colors duration-200"
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
      
      {/* Mobile Menu */}
      <div 
        id="mobile-menu"
        className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="px-4 pt-2 pb-4 space-y-1 bg-[#1e3a5f] border-t border-white/10">
          {navLinks.map((link) => (
            <a 
              key={link.href}
              href={link.href} 
              onClick={(e) => scrollToSection(e, link.href)} 
              className="text-white/90 hover:text-white hover:bg-white/10 block px-4 py-3 rounded-md text-base font-medium cursor-pointer transition-colors duration-200"
              data-testid={`mobile-${link.testId}`}
            >
              {link.label}
            </a>
          ))}
          <a 
            href="#contact" 
            onClick={(e) => scrollToSection(e, "#contact")} 
            className="mt-3 block w-full bg-white text-[#1e3a5f] text-center py-3 font-semibold rounded cursor-pointer hover:bg-gray-100 transition-colors duration-200"
            data-testid="mobile-nav-contact"
          >
            Contact
          </a>
          <a 
            href="https://accounts.americanseekersacademy.com/register/2OSQEAY3"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block w-full bg-[hsl(38,75%,45%)] hover:bg-[hsl(38,75%,40%)] text-white text-center py-3 font-semibold rounded cursor-pointer transition-colors duration-200"
            data-testid="mobile-nav-register"
          >
            Register Now
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
