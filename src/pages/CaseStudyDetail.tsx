import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Quote, Calendar, User, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import { cleanHtmlText, textToParagraphs, formatDate } from "@/lib/text-utils";

const CaseStudyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseStudy, setCaseStudy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaseStudy();
  }, [id]);

  const fetchCaseStudy = async () => {
    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .maybeSingle();

      if (error) throw error;
      setCaseStudy(data);
    } catch (error) {
      console.error('Failed to fetch case study:', error);
      setCaseStudy(null);
    } finally {
      setLoading(false);
    }
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

  // Helper function to render media content
  const renderMedia = (mediaUrls: any) => {
    if (!mediaUrls || typeof mediaUrls !== 'object') return null;
    
    const mediaArray = Array.isArray(mediaUrls) ? mediaUrls : Object.values(mediaUrls);
    if (mediaArray.length === 0) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaArray.map((url: string, index: number) => {
          const isVideo = url.includes('.mp4') || url.includes('.webm') || url.includes('.mov');
          
          return (
            <div key={index} className="relative group overflow-hidden rounded-lg bg-muted">
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
                <div className="aspect-video">
                  <img 
                    src={url} 
                    alt={`Case study media ${index + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Helper function to render clean text content
  const renderCleanText = (content: string) => {
    if (!content) return null;
    
    const cleanedText = cleanHtmlText(content);
    const paragraphs = textToParagraphs(cleanedText);
    
    return (
      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="leading-relaxed text-card-foreground">
            {paragraph}
          </p>
        ))}
      </div>
    );
  };

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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
                {caseStudy.title}
              </h1>
              
              {caseStudy.subtitle && (
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                  {caseStudy.subtitle}
                </p>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {(caseStudy.tags || []).map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {tag}
                  </Badge>
                ))}
                {(caseStudy.categories || []).map((category: string, index: number) => (
                  <Badge key={`cat-${index}`} className="px-3 py-1">
                    {category}
                  </Badge>
                ))}
              </div>

              {/* Navigation */}
              <Button 
                onClick={() => navigate("/")} 
                variant="ghost" 
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Case Studies
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-16">
          {/* Overview */}
          {caseStudy.description && (
            <section>
              <h2 className="text-3xl font-bold text-foreground mb-8">Overview</h2>
              <Card className="p-8 md:p-12">
                <div className="prose prose-lg max-w-none">
                  {renderCleanText(caseStudy.description)}
                </div>
              </Card>
            </section>
          )}

          {/* Challenge & Solution */}
          <div className="grid lg:grid-cols-2 gap-8">
            {caseStudy.challenge && (
              <section>
                <h2 className="text-3xl font-bold text-foreground mb-8">The Challenge</h2>
                <Card className="p-8 md:p-12 h-full">
                  <div className="prose max-w-none">
                    {renderCleanText(caseStudy.challenge)}
                  </div>
                </Card>
              </section>
            )}

            {caseStudy.solution && (
              <section>
                <h2 className="text-3xl font-bold text-foreground mb-8">Our Solution</h2>
                <Card className="p-8 md:p-12 h-full bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
                  <div className="prose max-w-none">
                    {renderCleanText(caseStudy.solution)}
                  </div>
                </Card>
              </section>
            )}
          </div>

          {/* Results */}
          {caseStudy.result && (
            <section>
              <h2 className="text-3xl font-bold text-foreground mb-8">Results & Impact</h2>
              <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="prose prose-lg max-w-none">
                  {renderCleanText(caseStudy.result)}
                </div>
              </Card>
            </section>
          )}

          {/* Media Gallery */}
          {caseStudy.media_urls && Object.keys(caseStudy.media_urls).length > 1 && (
            <section>
              <h2 className="text-3xl font-bold text-foreground mb-8">Project Gallery</h2>
              {renderMedia(caseStudy.media_urls)}
            </section>
          )}

          {/* Client Testimonial */}
          {caseStudy.testimonial && (
            <section>
              <Card className="p-8 md:p-12 bg-gradient-primary text-primary-foreground">
                <Quote className="w-12 h-12 mb-6 opacity-60" />
                <blockquote className="text-xl md:text-2xl italic leading-relaxed mb-6">
                  "{cleanHtmlText(caseStudy.testimonial)}"
                </blockquote>
                <cite className="text-lg opacity-90 font-medium">
                  — {caseStudy.client_name} Team
                </cite>
              </Card>
            </section>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <Card className="p-12 md:p-16 bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-50" />
            <div className="relative">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Business?
              </h3>
              <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
                Let's create a success story like this for your company. Get started with a free consultation.
              </p>
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                Start Your Project Today
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CaseStudyDetail;