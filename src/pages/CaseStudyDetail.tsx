import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, User, Play, ZoomIn, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import { formatDate } from "@/lib/text-utils";
import RichContentRenderer from "@/components/RichContentRenderer";
import { useCaseStudyLike } from "@/hooks/useCaseStudyLike";

interface CaseStudyType {
  id: string;
  title: string;
  subtitle?: string;
  client_name: string;
  content?: string;
  tags?: string[];
  categories?: string[];
  media_urls?: any;
  published_at?: string;
  slug?: string;
  status: string;
  likes_count?: number;
}

const CaseStudyDetail = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  const [caseStudy, setCaseStudy] = useState<CaseStudyType | null>(null);
  const [loading, setLoading] = useState(true);
  const { likes, isLiked, handleLike } = useCaseStudyLike(
    caseStudy?.id || '', 
    caseStudy?.likes_count || 0
  );

  useEffect(() => {
    if (identifier) {
      fetchCaseStudy();
    }
  }, [identifier]);

  const fetchCaseStudy = async () => {
    if (!identifier) return;
    
    setLoading(true);
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
      
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('status', 'published')
        .eq('id', identifier)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching case study:', error);
        setCaseStudy(null);
      } else {
        setCaseStudy(data);
      }
    } catch (error) {
      console.error('Error fetching case study:', error);
      setCaseStudy(null);
    } finally {
      setLoading(false);
    }
  };

  const renderMedia = (mediaUrls: any) => {
    if (!mediaUrls || typeof mediaUrls !== 'object') return null;
    
    const mediaArray = Array.isArray(mediaUrls) ? mediaUrls : Object.values(mediaUrls);
    if (mediaArray.length === 0) return null;

    const handleImageClick = (url: string) => {
      const lightbox = document.createElement('div');
      lightbox.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-pointer';
      lightbox.onclick = () => document.body.removeChild(lightbox);
      
      const img = document.createElement('img');
      img.src = url;
      img.className = 'max-w-[95vw] max-h-[95vh] object-contain rounded-lg shadow-2xl';
      img.onclick = (e) => e.stopPropagation();
      
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '×';
      closeBtn.className = 'absolute top-4 right-4 text-white text-5xl hover:text-gray-300 transition-colors font-light leading-none cursor-pointer';
      closeBtn.onclick = () => document.body.removeChild(lightbox);
      
      lightbox.appendChild(img);
      lightbox.appendChild(closeBtn);
      document.body.appendChild(lightbox);
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaArray.map((url: string, index: number) => {
          const isVideo = url.includes('.mp4') || url.includes('.webm') || url.includes('.mov');
          
          return (
            <div key={index} className="relative group overflow-hidden rounded-xl bg-muted shadow-lg hover:shadow-xl transition-shadow">
              {isVideo ? (
                <div className="relative aspect-video">
                  <video 
                    src={url} 
                    className="w-full h-full object-cover"
                    controls
                    poster={url.replace(/\.(mp4|webm|mov)$/, '.jpg')}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>
              ) : (
                <div className="aspect-video cursor-pointer" onClick={() => handleImageClick(url)}>
                  <img 
                    src={url} 
                    alt={`Case study media ${index + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <ZoomIn className="w-8 h-8 text-white" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading case study...</div>
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Case Study Not Found</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Case Studies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section - Full Width */}
      <section className="relative">
        {/* Hero Image */}
        {caseStudy.media_urls && Object.values(caseStudy.media_urls)[0] && (
          <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
            <img 
              src={Object.values(caseStudy.media_urls)[0] as string}
              alt={caseStudy.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
          </div>
        )}
        
        {/* Hero Content */}
        <div className="relative -mt-32 md:-mt-40">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{caseStudy.client_name}</span>
                </div>
                {caseStudy.published_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(caseStudy.published_at)}</span>
                  </div>
                )}
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-tight tracking-tight uppercase break-words">
                {caseStudy.title}
              </h1>
              
              {caseStudy.subtitle && (
                <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed">
                  {caseStudy.subtitle}
                </p>
              )}

              {/* Like Button */}
              <div className="mb-10">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike();
                  }}
                  className="gap-2 hover:scale-105 transition-all duration-300 border-accent/50 hover:bg-accent/10 hover:border-accent hover:text-accent"
                >
                  <Heart 
                    className={`w-5 h-5 transition-all duration-300 ${isLiked ? 'fill-accent text-accent' : ''}`}
                  />
                  <span className="font-bold">{likes} LIKES</span>
                </Button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-10">
                {(caseStudy.tags || []).map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="px-4 py-1.5 uppercase tracking-wider border-accent/50 text-accent hover:bg-accent/10">
                    {tag}
                  </Badge>
                ))}
                {(caseStudy.categories || []).map((category: string, index: number) => (
                  <Badge key={`cat-${index}`} className="px-4 py-1.5 uppercase tracking-wider bg-accent/20 text-accent border-accent/50">
                    {category}
                  </Badge>
                ))}
              </div>

              {/* Navigation */}
              <Button 
                onClick={() => navigate("/")} 
                variant="ghost" 
                className="text-muted-foreground hover:text-accent transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                BACK TO CASE STUDIES
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {/* Rich Content Sections */}
          {caseStudy.content && (
            <div className="space-y-8">
              <RichContentRenderer 
                content={caseStudy.content}
                className="text-card-foreground"
              />
            </div>
          )}

        {/* Media Gallery - Always show if there are media URLs */}
        {caseStudy.media_urls && Object.keys(caseStudy.media_urls).length > 0 && (
          <section className="mt-16 sm:mt-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-foreground mb-8 sm:mb-10 tracking-tight uppercase break-words">
              PROJECT <span className="text-accent">GALLERY</span>
            </h2>
            {renderMedia(caseStudy.media_urls)}
          </section>
        )}
      </div>

      {/* CTA Section */}
      <div className="mt-24 sm:mt-32 text-center">
        <Card className="p-8 sm:p-12 md:p-16 lg:p-20 bg-card/50 backdrop-blur-sm border-accent/30 shadow-elegant overflow-hidden relative mx-4 sm:mx-6">
          <div className="absolute inset-0 bg-gradient-accent opacity-5" />
          <div className="relative space-y-6 sm:space-y-8">
            <h3 className="text-2xl sm:text-3xl md:text-4xl mb-6 sm:mb-8 tracking-tight uppercase break-words">
              READY TO TRANSFORM YOUR <span className="text-accent">BUSINESS?</span>
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              Let's create a success story like this for your company. Get started with a free consultation.
            </p>
            <Button 
              size="lg" 
              variant="outline"
              className="px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg uppercase tracking-wider border-accent/50 hover:bg-accent/10 hover:border-accent text-accent hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              onClick={() => window.open('https://cal.com/ritish-nanchahal/call', '_blank')}
            >
              START YOUR PROJECT TODAY
            </Button>
          </div>
        </Card>
      </div>
    </main>
  </div>
);
};

export default CaseStudyDetail;