import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cormorant, geistSans } from "@/lib/fonts";
import { site } from "@/lib/site";
import { Providers } from "@/components/providers";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "wedding videographer London",
    "wedding photographer UK",
    "wedding films",
    "documentary wedding photography",
    "gele styling photography",
    "gele artist London",
    "asoebi photography",
    "bridal prep videographer",
    "Nigerian wedding videographer UK",
    "aso ebi photographer",
  ],
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    address: { "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" },
    sameAs: [site.instagram.url],
    description: site.description,
    knowsAbout: ["Wedding photography", "Wedding videography", "Gele styling", "Asoebi photography", "Bridal prep"],
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${geistSans.variable}`}>
      <body className="bg-ink font-sans text-paper antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <Providers>
          <Navigation />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
