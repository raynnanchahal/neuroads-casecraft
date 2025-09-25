import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";

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
      const { data, error } = await (supabase as any)
        .from('case_studies')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();

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

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Navigation */}
        <Button 
          onClick={() => navigate("/")} 
          variant="ghost" 
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Case Studies
        </Button>

        {/* Hero Section */}
        <div className="relative mb-12">
          <div 
            className="h-80 rounded-lg bg-cover bg-center relative overflow-hidden"
            style={{ backgroundImage: `url(${caseStudy.background_image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-background/20" />
            <div className="absolute bottom-8 left-8 right-8">
              <Badge className="mb-4 bg-background/90 text-foreground">
                {caseStudy.client_name}
              </Badge>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {caseStudy.headline}
              </h1>
              <div className="flex flex-wrap gap-2">
                {(caseStudy.tags || []).map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="bg-background/80">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Overview</h2>
            <Card className="p-8">
              <p className="text-card-foreground leading-relaxed text-lg">
                {caseStudy.overview}
              </p>
            </Card>
          </section>

          {/* Challenge & Solution */}
          <div className="grid md:grid-cols-2 gap-8">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">The Challenge</h2>
              <Card className="p-8 h-full">
                <p className="text-card-foreground leading-relaxed">
                  {caseStudy.challenge}
                </p>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Our Solution</h2>
              <Card className="p-8 h-full bg-gradient-accent text-accent-foreground">
                <p className="leading-relaxed">
                  {caseStudy.solution}
                </p>
              </Card>
            </section>
          </div>

          {/* Results */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Results</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {(caseStudy.results || []).map((result: any, index: number) => (
                <Card key={index} className="p-8 text-center">
                  <div className="text-4xl font-bold text-accent mb-2">
                    {result.value}
                  </div>
                  <div className="text-lg font-semibold text-card-foreground mb-2">
                    {result.metric}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {result.description}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Testimonial */}
          {caseStudy.testimonial && (
            <section>
              <Card className="p-8 bg-primary text-primary-foreground">
                <Quote className="w-8 h-8 mb-4 opacity-50" />
                <blockquote className="text-xl italic leading-relaxed mb-4">
                  "{caseStudy.testimonial}"
                </blockquote>
                <cite className="text-sm opacity-80">
                  — {caseStudy.client_name} Team
                </cite>
              </Card>
            </section>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="p-12 bg-gradient-primary text-primary-foreground">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Achieve Similar Results?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Let's discuss how we can help grow your business with proven strategies.
            </p>
            <Button size="lg" variant="secondary">
              Get Started Today
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CaseStudyDetail;