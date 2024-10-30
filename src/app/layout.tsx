import type { Metadata } from "next";
import React from 'react';
import localFont from "next/font/local";
import 'react-datalist-input/dist/styles.css';
import "./globals.css";
import validateUser from "./utils/validate";
import Logout from "@/components/Button/Logout";
import Login from "@/components/Button/Login";
import SignUp from "@/components/Button/SignUp";

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
          </div> : <div className="grid grid-cols-12 gap-4">
            <div className="col-start-11 col-end-11 justify-center">
              <Login />
            </div>
            <div className="col-start-12 col-end-12 justify-center">
              <SignUp />
            </div>
          </div>
        }
        {children}
      </body>
    </html>
  );
}
