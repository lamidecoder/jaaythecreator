/**
 * Site-wide configuration.
 *
 * Everything in this file is a placeholder value. Replace the fields marked
 * REPLACE below with the real details before launch. Nothing else in the
 * codebase needs to change; every page reads from here.
 */
export const site = {
  name: "Jaaythecreator",
  legalName: "Jaaythecreator",
  title: "Jaaythecreator — Wedding films & photography",
  description:
    "Wedding films and photography from Jaaythecreator, based in London and available wherever your story takes place.",

  // REPLACE: the live domain, once one is chosen. Used for metadata,
  // sitemap.xml and canonical URLs.
  url: "https://www.jaaythecreator.com",

  location: "London, UK",
  locationLine: "Based in London. Available wherever the story takes you.",

  // REPLACE: real contact details.
  email: "hello@jaaythecreator.com",
  phone: "+44 7000 000000",
  whatsapp: "https://wa.me/447000000000",

  // Matches the existing @jaaythecreaator handle.
  instagram: {
    handle: "@jaaythecreaator",
    url: "https://instagram.com/jaaythecreaator",
  },

  nav: [
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Booking", href: "/booking" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
