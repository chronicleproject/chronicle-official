import type { Metadata } from "next";
import "@fontsource-variable/newsreader/wght.css";
import "@fontsource/caveat/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chronicle — A Home for Builders",
  description:
    "Chronicle gives projects in progress a home for their purpose, people, evolving history, and discussion—so everyone can follow how the work takes shape.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
