import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              NeuroAds
            </h1>
            <span className="text-muted-foreground text-sm font-medium">
              Case Studies
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Ask anything... e.g., 'Have you worked with e-commerce brands?'"
                className="pl-10 bg-background/50 border-border focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Admin Button */}
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Admin
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;