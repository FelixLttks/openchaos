import type { Metadata } from "next";
import { DynamicTitle } from "@/components/DynamicTitle";
import "./globals.css";
import "./retro.css";

export const metadata: Metadata = {
  title: "OpenChaos.dev",
  description: "A self-evolving open source project. Vote on PRs. Winner gets merged every Sunday.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <DynamicTitle />
        {children}
      </body>
    </html>
  );
}
