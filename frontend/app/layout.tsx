import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";


const inter = Outfit({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "BFHL Store",
  description: "BFHL makes healthcare preventive, easy and fun.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
           <body className={inter.className}>
<Toaster/>
        {children}
      </body>
    </html>
  );
}
