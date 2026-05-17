import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Modern SaaS Admin Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <QueryProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                },
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
