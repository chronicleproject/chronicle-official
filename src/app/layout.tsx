import type { Metadata } from "next";
import "@fontsource-variable/newsreader/wght.css";
import "@fontsource/caveat/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chronicle — A Home for Builders",
  description:
    "Chronicle is a home for the projects shaping what comes next. Follow the progress, meet the people building, and see how ideas become something real.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
