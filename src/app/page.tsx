import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/layout/Hero";
import Features from "@/components/layout/Features";
import HowItWorks from "@/components/layout/HowItWorks";
import Pricing from "@/components/layout/Pricing";
import DashboardPreview from "@/components/layout/DashboardPreview";
import FinanzasPreview from "@/components/layout/FinanzasPreview";
import TestimonialsSection from "@/components/layout/TestimonialsSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <DashboardPreview />
      <Features />
      <FinanzasPreview />
      <HowItWorks />
      <TestimonialsSection />
      <Pricing />
      <Footer />
    </main>
  );
}