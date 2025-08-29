import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3" data-testid="navbar-brand">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-sm font-bold text-primary-foreground">
              P
            </div>
            <span className="font-semibold text-lg hidden sm:block">Prompt Builder</span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">UNESCO MIL</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-1" data-testid="navbar-nav">
            <Link href="/">
              <a className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location === "/" || location === "/builder" 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              }`} data-testid="nav-builder">
                🛠️ Builder
              </a>
            </Link>
            <Link href="/missions">
              <a className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location === "/missions" 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              }`} data-testid="nav-missions">
                🎯 Missions
              </a>
            </Link>
          </div>

          <button 
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground" 
            onClick={toggleMobileMenu}
            data-testid="mobile-menu-toggle"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border" data-testid="mobile-menu">
            <div className="space-y-2">
              <Link href="/">
                <a className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location === "/" || location === "/builder" 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground"
                }`} onClick={() => setIsMobileMenuOpen(false)}>
                  🛠️ Builder
                </a>
              </Link>
              <Link href="/missions">
                <a className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location === "/missions" 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground"
                }`} onClick={() => setIsMobileMenuOpen(false)}>
                  🎯 Missions
                </a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
