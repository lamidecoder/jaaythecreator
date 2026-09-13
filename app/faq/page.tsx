import type { Metadata } from "next";
import { Testimonials } from "@/components/testimonials";
import { FAQ } from "@/components/faq";

export const metadata: Metadata = {
  title: "Reviews & FAQ",
  description: "What clients say, and answers to common questions before you book.",
};

export default function FAQPage() {
  return (
    <div className="bg-ink px-6 pb-28 pt-40 sm:px-10 sm:pt-48">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-serif text-display text-paper">Reviews &amp; questions.</h1>
        <p className="mt-6 max-w-md font-sans text-base text-bone">
          {"What past clients have said, and the questions that come up most before booking."}
        </p>

        <Testimonials />
        <FAQ />
      </div>
    </div>
  );
}
