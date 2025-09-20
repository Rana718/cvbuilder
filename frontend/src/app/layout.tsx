import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Playfair_Display,
  Source_Sans_3,
  Poppins,
  Open_Sans,
  JetBrains_Mono,
  Roboto,
  Merriweather,
  Lato,
  Nunito,
  Nunito_Sans
} from "next/font/google";
import "./globals.css";
import AuthContext from "@/components/AuthContext";
import { Toaster } from "sonner";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Template fonts
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ResumeAI.World - Create Professional Resumes & Cover Letters with AI",
    template: "%s | ResumeAI.World"
  },
  description: "Create professional resumes and cover letters with our AI-powered CV builder. ATS-friendly templates, LinkedIn integration, and expert guidance. Build your perfect resume in minutes.",
  keywords: [
    "AI resume builder",
    "CV creator",
    "professional resume",
    "cover letter generator",
    "ATS friendly resume",
    "LinkedIn resume",
    "job application",
    "career tools",
    "resume templates",
    "CV builder online"
  ],
  authors: [{ name: "ResumeAI.World Team" }],
  creator: "ResumeAI.World",
  publisher: "ResumeAI.World",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://resumeai.world",
    siteName: "ResumeAI.World",
    title: "ResumeAI.World - Create Professional Resumes & Cover Letters with AI",
    description: "Create professional resumes and cover letters with our AI-powered CV builder. ATS-friendly templates, LinkedIn integration, and expert guidance.",
    images: [
      {
        url: "/img/banner.png",
        width: 1200,
        height: 630,
        alt: "ResumeAI.World - Professional Resume Creator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@resumeaiworld",
    creator: "@resumeaiworld",
    title: "ResumeAI.World - Create Professional Resumes & Cover Letters with AI",
    description: "Create professional resumes and cover letters with our AI-powered CV builder. ATS-friendly templates, LinkedIn integration, and expert guidance.",
    images: ["/img/banner.png"],
  },
  verification: {
    google: "your-google-site-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
    other: {
      me: ["mailto:contact@resumeai.world"],
    },
  },
  alternates: {
    canonical: "https://resumeai.world",
  },
  category: "Business Tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ResumeAI.World",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    url: "https://resumeai.world",
    description: "Create professional resumes and cover letters with our AI-powered CV builder. ATS-friendly templates, LinkedIn integration, and expert guidance.",
    author: {
      "@type": "Organization",
      name: "ResumeAI.World Team",
      url: "https://resumeai.world"
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock"
    },
    featureList: [
      "AI-powered resume creation",
      "ATS-friendly templates",
      "LinkedIn integration",
      "Cover letter generator",
      "Multiple export formats",
      "Professional templates"
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "1250"
    }
  };

  return (
    <html lang="en">
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="canonical" href="https://resumeai.world" />
        <meta name="theme-color" content="#1e40af" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ResumeAI.World" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="ResumeAI.World" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#1e40af" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${playfairDisplay.variable} ${sourceSans3.variable} ${poppins.variable} ${openSans.variable} ${jetbrainsMono.variable} ${roboto.variable} ${merriweather.variable} ${lato.variable} ${nunito.variable} ${nunitoSans.variable} antialiased`}
      >
        <AuthContext>{children}</AuthContext>
        <Toaster />
      </body>
    </html>
  );
}
