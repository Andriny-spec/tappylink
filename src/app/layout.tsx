import './globals.css'
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Providers } from './providers'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ChatWrapper } from "@/components/ui/chat-wrapper";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "Tappy ID",
  description: "Transforme seu networking com cartões digitais NFC e QR Code",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tappy ID",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#17d300",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <div className="fixed inset-0 -z-10 gradient-bg" />
        <Providers>
          <ChatWrapper>
            {children}
          </ChatWrapper>
          <Toaster />
          <SonnerToaster position="top-right" closeButton />
          <Script
            id="register-sw"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').then(
                      function(registration) {
                        console.log('Service Worker registrado com sucesso:', registration.scope);
                      },
                      function(err) {
                        console.log('Falha ao registrar Service Worker:', err);
                      }
                    );
                  });
                }
              `,
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
