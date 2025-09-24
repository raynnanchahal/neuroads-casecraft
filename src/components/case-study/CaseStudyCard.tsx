import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface CaseStudyCardProps {
  id: string;
  backgroundImage: string;
  clientName: string;
  headline: string;
  tags: string[];
  onClick: () => void;
}

const CaseStudyCard = ({
  backgroundImage,
  clientName,
  headline,
  tags,
  onClick
}: CaseStudyCardProps) => {
  return (
    <Card 
      className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 bg-card"
      onClick={onClick}
    >
      {/* Background Image */}
      <div 
        className="h-48 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        
        {/* Client Badge */}
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-background/90 text-foreground backdrop-blur-sm">
            {clientName}
          </Badge>
        </div>

        {/* Arrow Icon */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center">
            <ArrowRight className="w-4 h-4 text-foreground" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <h3 className="font-semibold text-lg text-card-foreground line-clamp-2 group-hover:text-accent transition-colors">
          {headline}
        </h3>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs border-border text-muted-foreground hover:border-accent hover:text-accent transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default CaseStudyCard;