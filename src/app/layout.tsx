import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/custom-toast";

const inter = Inter({ subsets: ["latin"] });
const dmSerifDisplay = DM_Serif_Display({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif-display"
});

export const metadata: Metadata = {
  title: "Arunachal Film Festival",
  description: "Arunachal Film Festival",
  icons: {
    icon: "/logofavicon.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${dmSerifDisplay.variable}`}>
          <ToastProvider>
            {children}
          </ToastProvider>
      </body>
    </html>
  );
}
