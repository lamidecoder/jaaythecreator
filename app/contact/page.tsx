import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about your wedding film and photography.",
};

export default function ContactPage() {
  return (
    <div className="bg-ink px-6 pb-28 pt-40 sm:px-10 sm:pt-48">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 sm:grid-cols-12 sm:gap-10">
          <div className="sm:col-span-5">
            <h1 className="font-serif text-display text-paper">Start your story.</h1>
            <p className="mt-6 max-w-sm font-sans text-base leading-relaxed text-bone">
              {"Tell us about the day and we'll take it from there. We usually reply within two working days."}
            </p>

            <dl className="mt-12 space-y-6 font-sans text-sm">
              <div>
                <dt className="text-paper/40">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${site.email}`} className="text-paper transition-colors hover:text-wine-soft">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-paper/40">WhatsApp</dt>
                <dd className="mt-1">
                  <a href={site.whatsapp} className="text-paper transition-colors hover:text-wine-soft">
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-paper/40">Instagram</dt>
                <dd className="mt-1">
                  <a href={site.instagram.url} className="text-paper transition-colors hover:text-wine-soft">
                    {site.instagram.handle}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-paper/40">Based in</dt>
                <dd className="mt-1 text-paper">{site.location}</dd>
              </div>
            </dl>
          </div>

          <div className="sm:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
