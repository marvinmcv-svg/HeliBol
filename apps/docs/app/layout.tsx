import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SiteHeader } from "@/components/site-header";
import { CommandMenu } from "@/components/command-menu";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "kinetik — the motion library for web & mobile", template: "%s · kinetik" },
  description:
    "70+ copy-paste animated components, blocks and mobile flows for React, Next.js and React Native. Live previews, source, install command and an AI prompt for every piece.",
};

const boot = `try{var t=localStorage.getItem("theme");if(t!=="light")document.documentElement.classList.add("dark");if(localStorage.getItem("kinetik-reduce-motion")==="1")document.documentElement.setAttribute("data-reduce-motion","")}catch(e){document.documentElement.classList.add("dark")}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body className="min-h-dvh font-sans antialiased">
        <Providers>
          <SiteHeader />
          {children}
          <CommandMenu />
        </Providers>
      </body>
    </html>
  );
}
