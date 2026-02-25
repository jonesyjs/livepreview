import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ContentfulPreviewProvider } from "@/components/contentful-preview-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Live Preview Demo",
  description: "Contentful Live Preview SDK demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Hardcoded to true for demo — in production, tie these to draftMode().isEnabled */}
        <ContentfulPreviewProvider
          locale="en-US"
          enableLiveUpdates={true}
          enableInspectorMode={true}
        >
          {children}
        </ContentfulPreviewProvider>
      </body>
    </html>
  );
}
