import "~/styles/globals.css";

import { type Metadata } from "next";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "RoboCupido | Encuentra tu match ideal",
  description: "By Roborregos",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geist.variable} ${plusJakartaSans.variable}`}>
      <body >
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
