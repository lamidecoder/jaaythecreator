import type { Metadata } from "next";
import { AboutSection } from "@/components/about-section";

export const metadata: Metadata = {
  title: "About",
  description: "The studio behind Jaaythecreator, and how we approach a wedding day.",
};

export default function AboutPage() {
  return <AboutSection />;
}
