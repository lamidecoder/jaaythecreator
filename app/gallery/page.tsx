import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery-grid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A closer look at the photography, outside the context of any one wedding.",
};

export default function GalleryPage() {
  return <GalleryGrid />;
}
