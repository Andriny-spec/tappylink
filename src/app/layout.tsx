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
  title: "Tappy ID | Cartões Digitais NFC e QR Code",
  description: "Revolucione seu networking com cartões digitais NFC e QR Code da Tappy ID. Compartilhe seu perfil, redes sociais e contatos com apenas um toque.",
  keywords: "cartões digitais, NFC, QR Code, networking, Tappy ID, cartão de visita digital, tecnologia NFC",
  manifest: "/manifest.json",
  icons: [
    { rel: "icon", url: "/favicon.svg" },
    { rel: "apple-touch-icon", url: "/favicon.svg" }
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tappy ID",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.tappyid.com.br",
    title: "Tappy ID | Cartões Digitais NFC e QR Code",
    description: "Revolucione seu networking com cartões digitais NFC e QR Code da Tappy ID. Compartilhe seu perfil, redes sociais e contatos com apenas um toque.",
    siteName: "Tappy ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tappy ID | Cartões Digitais NFC e QR Code",
    description: "Revolucione seu networking com cartões digitais NFC e QR Code da Tappy ID.",
    creator: "@tappyid",
  },
  robots: {
    index: true,
    follow: true,
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
        <link rel="icon" href="/TAPPY - SOMENTE A LOGO - VERDE.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#17d300" />
        <meta property="og:image" content="/images/tappy-og-image.jpg" />
        <meta name="twitter:image" content="/images/tappy-og-image.jpg" />
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
