import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import CaseStudyCard from "@/components/case-study/CaseStudyCard";
import { supabase } from "@/integrations/supabase/client";

const CaseStudies = () => {
  const navigate = useNavigate();
  const [caseStudies, setCaseStudies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('case_studies')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCaseStudies(data || []);
    } catch (error) {
      console.error('Failed to fetch case studies:', error);
      // Fallback to empty array if database fails
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
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Success Stories That Drive Results
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore how we've helped leading brands achieve exceptional growth through data-driven marketing strategies and innovative advertising solutions.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                backgroundImage={caseStudy.background_image}
                clientName={caseStudy.client_name}
                headline={caseStudy.headline}
                tags={caseStudy.tags || []}
                onClick={() => handleCaseStudyClick(caseStudy.id)}
              />
            ))
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-card rounded-lg shadow-card p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-card-foreground mb-2">
              Proven Results Across Industries
            </h2>
            <p className="text-muted-foreground">
              Our data-driven approach delivers consistent growth for our clients
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-accent mb-2">300+</div>
              <div className="text-muted-foreground">Campaigns Launched</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">$50M+</div>
              <div className="text-muted-foreground">Ad Spend Managed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">4.2x</div>
              <div className="text-muted-foreground">Average ROAS</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">95%</div>
              <div className="text-muted-foreground">Client Retention</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaseStudies;