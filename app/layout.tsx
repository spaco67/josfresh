import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/toast";
import { CldUploadWidget } from 'next-cloudinary';
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JosFresh | Farm to Table Marketplace",
  description: "Connect directly with farmers and buy fresh produce",
  keywords: ["farmers market", "fresh produce", "direct sales", "agriculture"],
  other: {
    'next-cloudinary': {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          type="text/javascript"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider session={session}>
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
