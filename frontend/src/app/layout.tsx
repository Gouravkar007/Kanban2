import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlowKanban - Project Management Workspace",
  description: "A slick, modern, single-board Kanban project management application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-darkNavy text-white">
        {children}
      </body>
    </html>
  );
}
