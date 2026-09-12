import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/manifesto";
import { Showcase } from "@/components/showcase";
import { AboutTeaser } from "@/components/about-teaser";
import { ServicesSection } from "@/components/services-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Showcase />
      <AboutTeaser />
      <ServicesSection />
    </>
  );
}
