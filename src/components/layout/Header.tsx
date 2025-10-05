import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="NeuroAds Logo" className="h-10 w-auto" />
            <span className="text-2xl font-bold text-foreground tracking-tight">
              NEURO ADS
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-6">
            <a 
              href="https://neural-scroll-spark-74.lovable.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground hover:text-accent transition-colors font-medium"
            >
              Homepage
            </a>
            <a 
              href="https://creative-win-machine.lovable.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground hover:text-accent transition-colors font-medium"
            >
              High Converting Creatives
            </a>
            <a 
              href="https://calendly.com/ritishnanchahal-amld/discovery" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                Schedule Call
              </Button>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;