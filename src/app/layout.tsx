import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Jodiyaan — Indian Matrimonial Platform",
    template: "%s · Jodiyaan",
  },
  description:
    "A modern Indian matrimonial platform rooted in values, culture, and family. Meaningful introductions and safer conversations.",
};

export const viewport: Viewport = {
  themeColor: "#FDF4EB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
