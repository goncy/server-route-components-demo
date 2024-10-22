import type {Metadata} from "next";

import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "server-route-components",
  description: "Generated by appncy",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="container m-auto grid min-h-screen grid-rows-[auto,1fr,auto] bg-background px-4 font-sans antialiased">
        <header className="text-xl font-bold leading-[4rem]">
          <Link href="/">server-route-components</Link>
        </header>
        <main className="py-8">{children}</main>
        <footer className="text-center leading-[4rem] opacity-70">
          © {new Date().getFullYear()} server-route-components
        </footer>
      </body>
    </html>
  );
}
