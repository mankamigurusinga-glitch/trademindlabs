import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero, SocialProof } from "@/components/landing/Hero";
import { Features, HowItWorks, LiveDemo } from "@/components/landing/Sections";
import { Comparison, LiveMarketStatus, Testimonials } from "@/components/landing/Insights";
import { WhyTradeMind, Pricing, FAQ, FinalCTA } from "@/components/landing/Content";
import { Footer } from "@/components/landing/Footer";

const title = "TradeMind AI — Trade Smarter with AI";
const description =
  "AI-powered crypto futures analysis that explains every opportunity with reasoning, probability, confidence score and risk management.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Nav />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <LiveMarketStatus />
        <HowItWorks />
        <LiveDemo />
        <Comparison />
        <WhyTradeMind />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
