import type { Metadata } from "next";
import { WorkGrid } from "@/components/work-grid";

export const metadata: Metadata = {
  title: "Work",
  description: "Wedding films and photography from across the UK and beyond.",
};

export default function WorkPage() {
  return <WorkGrid />;
}
