import type { Metadata } from "next";
import "./globals.css";
import "./globals-lambda.css";

export const metadata: Metadata = {
  title: "Lambda — The Superintelligence Cloud",
  description:
    "Lambda provides supercomputers for AI training and inference. " +
    "Purpose-built datacenters, AI infrastructure, managed services, " +
    "and co-engineering — ready for superintelligence.",
  openGraph: {
    type:        "website",
    url:         "https://lambda.ai",
    title:       "Lambda — The Superintelligence Cloud",
    description:
      "Supercomputers for AI training and inference. " +
      "Purpose-built datacenters with NVIDIA GPUs, liquid cooling, " +
      "and high-density power, designed for peak AI performance.",
    siteName: "Lambda",
    images: [
      {
        url:    "https://lambda.ai/hubfs/og-image.png",
        width:  1200,
        height: 630,
        alt:    "Lambda — The Superintelligence Cloud",
      },
    ],
  },
  twitter: {
    card:        "summary_large_image",
    site:        "@LambdaAPI",
    title:       "Lambda — The Superintelligence Cloud",
    description: "Supercomputers for AI training and inference.",
    images:      ["https://lambda.ai/hubfs/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
