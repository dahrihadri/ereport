import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { ToastProvider } from '@/components/ui/ToastProvider';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DMDPR - Project Management System",
  description: "MCMC Project Management and Tracking System for monitoring employee workload and project progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
        <Toaster
          position="top-center"
          closeButton={false}
          expand={false}
          richColors
          duration={4000}
          gap={16}
          offset={24}
          toastOptions={{
            unstyled: false,
            classNames: {
              toast: 'sonner-toast',
              title: 'sonner-title',
              description: 'sonner-description',
            },
          }}
        />
      </body>
    </html>
  );
}
