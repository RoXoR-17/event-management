import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";

import "./globals.css";

const MainProvider = dynamic(() => import("./MainProvider"));

const primaryFont = Inter({ variable: "--rs-primary-font", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dental Clinic Management App",
  description: "A Dental Clinic Management Application",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Dental Clinic Management App" />
      </head>
      <body className={`${primaryFont.variable}`}>
        <MainProvider>{children}</MainProvider>
      </body>
    </html>
  );
}
