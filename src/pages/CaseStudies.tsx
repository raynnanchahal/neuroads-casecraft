import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import CaseStudyCard from "@/components/case-study/CaseStudyCard";
import { sampleCaseStudies } from "@/data/sampleCaseStudies";

const CaseStudies = () => {
  const navigate = useNavigate();
  const [caseStudies] = useState(sampleCaseStudies);

  const handleCaseStudyClick = (id: string) => {
    navigate(`/case-study/${id}`);
  };

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
          {caseStudies.map((caseStudy) => (
            <CaseStudyCard
              key={caseStudy.id}
              id={caseStudy.id}
              backgroundImage={caseStudy.backgroundImage}
              clientName={caseStudy.clientName}
              headline={caseStudy.headline}
              tags={caseStudy.tags}
              onClick={() => handleCaseStudyClick(caseStudy.id)}
            />
          ))}
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