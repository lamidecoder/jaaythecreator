import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            color: "#FAF8F1",
            textAlign: "center",
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#8F8B82",
            textAlign: "center",
          }}
        >
          Weddings · Bridal Prep · Asoebi Moments
        </div>
      </div>
    ),
    { ...size },
  );
}
