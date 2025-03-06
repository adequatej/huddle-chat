import type { Metadata } from 'next';
import { Geist, Geist_Mono as GeistMono } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = GeistMono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const basicMetadata = {
  title: 'Huddle Chat',
  description:
    'An online chat app connecting MBTA riders taking the same transit or waiting at the same stop.',
};

export const metadata: Metadata = {
  title: basicMetadata.title,
  description: basicMetadata.description,
  openGraph: {
    type: 'website',
    url: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    title: basicMetadata.title,
    description: basicMetadata.description,
  },
  authors: [
    { name: 'Jed Geoghegan', url: 'https://github.com/adequatej' },
    { name: 'Leo Hirano', url: 'https://github.com/notLeoHirano' },
    { name: 'Benson Lin', url: 'https://github.com/Zirins' },
    { name: 'Daniel Stoiber', url: 'https://github.com/da-stoi' },
    { name: 'Bryan Suria', url: 'https://github.com/BSuria' },
  ],
  keywords: ['chat', 'transit', 'MBTA', 'commute', 'public transit'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            {children}
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
