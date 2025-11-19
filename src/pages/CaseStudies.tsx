import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import CaseStudyCard from "@/components/case-study/CaseStudyCard";

const CaseStudies = () => {
  const navigate = useNavigate();
  const [caseStudies, setCaseStudies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setCaseStudies(data || []);
    } catch (error) {
      console.error('Failed to fetch case studies:', error);
      setCaseStudies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCaseStudyClick = (id: string) => {
    navigate(`/case-study/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading case studies...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20 space-y-4 sm:space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-foreground leading-tight tracking-tight break-words">
            SUCCESS STORIES THAT <span className="text-accent">DRIVE RESULTS</span>
          </h1>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {caseStudies.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-semibold text-muted-foreground">
                No case studies available yet
              </h3>
              <p className="text-muted-foreground">
                Check back soon for our latest success stories
              </p>
            </div>
          ) : (
            caseStudies.map((caseStudy: any) => (
              <CaseStudyCard
                key={caseStudy.id}
                id={caseStudy.id}
                backgroundImage={caseStudy.media_urls?.[0] || '/placeholder.svg'}
                clientName={caseStudy.client_name}
                headline={caseStudy.title}
                tags={caseStudy.tags || []}
                likesCount={caseStudy.likes_count || 0}
                onClick={() => handleCaseStudyClick(caseStudy.id)}
              />
            ))
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-20 sm:mt-24 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-elegant p-8 sm:p-12">
          <div className="text-center mb-8 sm:mb-12 space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-card-foreground tracking-tight break-words">
              PROVEN RESULTS ACROSS <span className="text-accent">INDUSTRIES</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Our data-driven approach delivers consistent growth for our clients
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 text-center">
            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl md:text-6xl text-accent mb-2 sm:mb-3">5000+</div>
              <div className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground">Campaigns Launched</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl md:text-6xl text-accent mb-2 sm:mb-3">$100M+</div>
              <div className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground">Generated</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl md:text-6xl text-accent mb-2 sm:mb-3">4.2x</div>
              <div className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground">Average ROAS</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl md:text-6xl text-accent mb-2 sm:mb-3">95%</div>
              <div className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground">Client Retention</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaseStudies;