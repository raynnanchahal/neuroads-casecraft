export interface CaseStudy {
  id: string;
  clientName: string;
  headline: string;
  tags: string[];
  backgroundImage: string;
  content: {
    overview: string;
    challenge: string;
    solution: string;
    results: {
      metric: string;
      value: string;
      description: string;
    }[];
    testimonial?: string;
  };
}

export const sampleCaseStudies: CaseStudy[] = [
  {
    id: "1",
    clientName: "TechFlow Solutions",
    headline: "Revolutionizing B2B SaaS Lead Generation with AI-Powered Targeting",
    tags: ["B2B SaaS", "Lead Generation", "AI Targeting", "300% ROI"],
    backgroundImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    content: {
      overview: "TechFlow Solutions, a rapidly growing B2B SaaS platform, was struggling to identify and convert high-quality leads. Their traditional marketing approach was generating volume but lacked precision in targeting decision-makers.",
      challenge: "The company faced declining conversion rates, high customer acquisition costs, and difficulty reaching the right stakeholders in target organizations. Their existing campaigns had a 1.2% conversion rate and were primarily attracting low-intent prospects.",
      solution: "We implemented a comprehensive AI-powered targeting strategy combining lookalike modeling, behavioral analysis, and intent data. Our approach included personalized ad creative, multi-touch attribution modeling, and dynamic audience optimization across LinkedIn, Google, and programmatic display.",
      results: [
        {
          metric: "Conversion Rate",
          value: "+340%",
          description: "From 1.2% to 5.3% across all campaigns"
        },
        {
          metric: "Cost per Lead",
          value: "-65%",
          description: "Reduced from $180 to $63 per qualified lead"
        },
        {
          metric: "Pipeline Value",
          value: "$2.4M",
          description: "Generated in qualified pipeline over 6 months"
        }
      ],
      testimonial: "NeuroAds completely transformed our approach to B2B marketing. The AI-powered targeting delivered leads that actually convert into customers."
    }
  },
  {
    id: "2",
    clientName: "EcoLux Fashion",
    headline: "Scaling Sustainable Fashion Brand to $10M Revenue Through Performance Marketing",
    tags: ["E-commerce", "Fashion", "Sustainability", "Scale Growth"],
    backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
    content: {
      overview: "EcoLux Fashion, a sustainable fashion startup, needed to scale from $500K to $10M in annual revenue while maintaining their commitment to ethical manufacturing and environmental responsibility.",
      challenge: "The brand struggled with customer acquisition costs in the competitive fashion space, difficulty communicating their sustainability message effectively, and scaling profitable ad spend beyond $10K/month.",
      solution: "We developed a comprehensive growth strategy focusing on storytelling around sustainability, influencer partnerships, and performance-driven creative testing. Our approach included video-first creative, social proof integration, and advanced audience segmentation based on values and lifestyle.",
      results: [
        {
          metric: "Revenue Growth",
          value: "+1,900%",
          description: "Scaled from $500K to $10M annual revenue"
        },
        {
          metric: "ROAS",
          value: "4.2x",
          description: "Maintained across all paid channels"
        },
        {
          metric: "Customer LTV",
          value: "+280%",
          description: "Improved through better customer matching"
        }
      ]
    }
  },
  {
    id: "3",
    clientName: "FinanceFirst App",
    headline: "Driving 500K App Downloads for Personal Finance Platform in Competitive Market",
    tags: ["Fintech", "Mobile App", "User Acquisition", "Competitive"],
    backgroundImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
    content: {
      overview: "FinanceFirst, a personal finance management app, launched into an extremely competitive market dominated by established players. They needed to acquire users quickly and cost-effectively to gain market traction.",
      challenge: "High competition from established apps, expensive keywords, and difficulty differentiating in a crowded market. Initial campaigns were achieving high CPIs and low user retention rates.",
      solution: "We implemented a multi-channel user acquisition strategy focusing on unique value propositions, behavioral targeting, and creative testing at scale. Our approach included App Store Optimization, social media advertising, and strategic influencer partnerships.",
      results: [
        {
          metric: "App Downloads",
          value: "500K+",
          description: "Achieved in first 12 months"
        },
        {
          metric: "Cost Per Install",
          value: "-70%",
          description: "Reduced from $8.50 to $2.55"
        },
        {
          metric: "30-Day Retention",
          value: "+155%",
          description: "Improved user quality and engagement"
        }
      ]
    }
  }
];