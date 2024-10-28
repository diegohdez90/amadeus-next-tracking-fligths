import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import validateUser from "./utils/validate";

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
          username ? <>{username}</> : null
        }
        {children}
      </body>
    </html>
  );
}
