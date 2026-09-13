import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/manifesto";
import { MomentsGrid } from "@/components/moments-grid";
import { AboutTeaser } from "@/components/about-teaser";
import { ServicesSection } from "@/components/services-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <MomentsGrid />
      <AboutTeaser />
      <ServicesSection />
    </>
  );
}
