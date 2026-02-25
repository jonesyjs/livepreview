import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { draftMode } from "next/headers";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled } = await draftMode();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ContentfulPreviewProvider
          locale="en-US"
          enableLiveUpdates={isEnabled}
          enableInspectorMode={isEnabled}
        >
          {children}
        </ContentfulPreviewProvider>
      </body>
    </html>
  );
}
