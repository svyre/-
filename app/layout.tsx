import type { Metadata } from "next";
import "./globals.css";
import "./fintech.css";

export const metadata: Metadata = {
  title: "на себе",
  description: "Первый год самостоятельной жизни. Командная финансовая стратегия для 10–11 классов.",
  icons: {
    icon: "/mark.svg?v=2",
    shortcut: "/mark.svg?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
