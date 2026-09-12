import type { Metadata } from "next";
import { BookingSection } from "@/components/booking-section";

export const metadata: Metadata = {
  title: "Booking",
  description: "Book a wedding, bridal prep, or asoebi session.",
};

export default function BookingPage() {
  return <BookingSection />;
}
