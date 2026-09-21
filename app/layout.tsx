import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://play.crux8.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "What Type of Climber Are You? | Crux8",
  description: "Find your climbing personality in 60 seconds. No sign-up. Just climbing.",
  openGraph: {
    title: "What Type of Climber Are You? | Crux8",
    description: "Find your climbing personality in 60 seconds.",
    url: siteUrl,
    siteName: "Crux8 Play",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "What Type of Climber Are You? | Crux8",
    description: "Find your climbing personality in 60 seconds.",
  },
};

export const viewport: Viewport = {
  themeColor: "#070708",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-display text-[#F5EFE0]">{children}</body>
    </html>
  );
}
