import type { Metadata } from "next";
import React from 'react';
import localFont from "next/font/local";
import "./globals.css";
import validateUser from "./utils/validate";
import Logout from "@/components/Button/Logout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Book your flight",
  description: "Free use to book your next flight",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const username = await validateUser()

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {
          username ? <div className="grid grid-cols-12 gap-4">
            <div className="col-span-10 flex justify-center">
              <p>{username}</p>
            </div>
            <div className="col-span-2 flex justify-center">
              <Logout />
            </div>
          </div> : null
        }
        {children}
      </body>
    </html>
  );
}
