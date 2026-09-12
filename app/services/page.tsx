import type { Metadata } from "next";
import { ServicesSection } from "@/components/services-section";

export const metadata: Metadata = {
  title: "Services",
  description: "Wedding films, photography, engagements, pre-weddings, and event coverage.",
};

export default function ServicesPage() {
  return (
    <div className="pt-16 sm:pt-16">
      <ServicesSection headingLevel="h1" />
    </div>
  );
}
