import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Limitless Infotech - Innovative Tech Solutions',
  description: 'Leading provider of web development, mobile apps, custom software, CRM systems, and AI automation. Transform your business with cutting-edge technology solutions.',
  keywords: ['web development', 'mobile apps', 'custom software', 'CRM systems', 'AI automation', 'technology solutions'],
  authors: [{ name: 'Limitless Infotech' }],
  creator: 'Limitless Infotech',
  publisher: 'Limitless Infotech',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://limitlessinfotech.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Limitless Infotech - Innovative Tech Solutions',
    description: 'Leading provider of web development, mobile apps, custom software, CRM systems, and AI automation.',
    url: 'https://limitlessinfotech.com',
    siteName: 'Limitless Infotech',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Limitless Infotech - Innovative Tech Solutions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Limitless Infotech - Innovative Tech Solutions',
    description: 'Leading provider of web development, mobile apps, custom software, CRM systems, and AI automation.',
    images: ['/og-image.jpg'],
    creator: '@limitlessinfotech',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};
