import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO Metadata
export const metadata: Metadata = {
  title: {
    default: "Custom Business Hats | Premium Embroidered Hats for Teams & Businesses",
    template: "%s | Custom Business Hats",
  },
  description: "Order premium custom embroidered hats for your business, team, or event. Richardson, Yupoong, Flexfit & more. No minimums, free shipping on 24+ hats. Made in USA with 10-15 business day turnaround.",
  keywords: [
    "custom hats",
    "embroidered hats",
    "custom business hats",
    "corporate hats",
    "team hats",
    "Richardson hats",
    "Yupoong hats",
    "trucker hats custom",
    "logo hats",
    "branded hats",
    "custom caps",
    "embroidered caps",
    "promotional hats",
    "company hats",
    "custom trucker hats",
    "bulk custom hats",
  ],
  authors: [{ name: "Custom Business Hats" }],
  creator: "Custom Business Hats",
  publisher: "Custom Business Hats",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://custombusinesshats.com",
    siteName: "Custom Business Hats",
    title: "Custom Business Hats | Premium Embroidered Hats for Teams & Businesses",
    description: "Order premium custom embroidered hats for your business, team, or event. No minimums, free shipping on 24+ hats. Made in USA.",
    images: [
      {
        url: "/cbh-logo-dark.png.jpg",
        width: 1200,
        height: 630,
        alt: "Custom Business Hats - Premium Embroidered Hats",
      },
    ],
  },
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Custom Business Hats | Premium Embroidered Hats",
    description: "Order premium custom embroidered hats. No minimums, free shipping on 24+ hats. Made in USA.",
    images: ["/cbh-logo-dark.png.jpg"],
    creator: "@custombusinesshats",
  },
  // Site verified via Google Search Console
  // Canonical URL
  alternates: {
    canonical: "https://custombusinesshats.com",
  },
  // Category
  category: "E-commerce",
};

// Structured Data - LocalBusiness Schema
const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://custombusinesshats.com",
  name: "Custom Business Hats",
  description: "Premium custom embroidered hats for businesses, teams, and events. Richardson, Yupoong, Flexfit and more.",
  url: "https://custombusinesshats.com",
  email: "support@custombusinesshats.com",
  image: "https://custombusinesshats.com/cbh-logo-dark.png",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    addressCountry: "US",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "17:00",
  },
  sameAs: [
    // Add your social media URLs here
    // "https://facebook.com/custombusinesshats",
    // "https://instagram.com/custombusinesshats",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "301",
    bestRating: "5",
    worstRating: "1",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Custom Embroidered Hats",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Richardson 112 Custom Hat",
          description: "Premium Richardson 112 trucker hat with custom embroidery",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Yupoong 6606 Custom Hat",
          description: "Classic Yupoong 6606 snapback with custom embroidery",
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1351354322977059');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1351354322977059&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-text`}
      >
        {children}
      </body>
    </html>
  );
}
