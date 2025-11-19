import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import SearchDialog from "./SearchDialog";
import logo from "@/assets/neuro-ads-logo.png";

const Header = () => {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  return (
    <>
      <header className="bg-card/50 backdrop-blur-md border-b border-border/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo */}
            <a href="https://neuroads.agency" className="flex items-center gap-2 sm:gap-4 shrink-0">
              <img src={logo} alt="NeuroAds" className="h-8 sm:h-10 w-auto" />
            </a>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative cursor-pointer" onClick={() => setSearchDialogOpen(true)}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Ask anything..."
                  className="pl-10 bg-background/50 border-border/50 focus:border-accent transition-all duration-300 cursor-pointer hover:border-accent/50 text-sm sm:text-base"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <SearchDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen} />
    </>
  );
};

export default Header;