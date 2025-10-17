import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SearchDialog from "./SearchDialog";

const Header = () => {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  return (
    <>
      <header className="bg-card/50 backdrop-blur-md border-b border-border/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-6">
              <Link to="https://neural-scroll-spark-74.lovable.app/" target="_blank" rel="noopener noreferrer">
                <h1 className="text-2xl font-bold text-foreground tracking-tight uppercase hover:text-accent transition-colors">
                  NEURO<span className="text-accent">ADS</span>
                </h1>
              </Link>
              <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                Case Studies
              </span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative cursor-pointer" onClick={() => setSearchDialogOpen(true)}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Ask anything... e.g., 'Have you worked with e-commerce brands?'"
                  className="pl-10 bg-background/50 border-border/50 focus:border-accent transition-all duration-300 cursor-pointer hover:border-accent/50"
                  readOnly
                />
              </div>
            </div>

            {/* Admin Button */}
            <Link to="/admin/login">
              <Button 
                variant="outline" 
                className="border-accent/50 text-accent hover:bg-accent/10 hover:border-accent transition-all duration-300 uppercase tracking-wider font-bold"
              >
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <SearchDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen} />
    </>
  );
};

export default Header;