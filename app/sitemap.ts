import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { projects } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/work", "/about", "/services", "/booking", "/gallery", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${site.url}/work/${project.slug}`,
    lastModified: new Date(project.date),
  }));

  return [...staticRoutes, ...projectRoutes];
}
