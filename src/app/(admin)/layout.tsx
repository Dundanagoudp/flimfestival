import type { Metadata } from "next";
import { Inter, DM_Serif_Display, Montserrat } from "next/font/google";
import PublicLayoutWrapper from "@/components/publicLayoutWrapper";

const inter = Inter({ subsets: ["latin"] });
const dmSerifDisplay = DM_Serif_Display({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif-display"
});
const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-montserrat"
});

export const metadata: Metadata = {
  title: "Arunachal Film Festival - Admin",
  description: "Admin Panel for Arunachal Film Festival",
  icons: {
    icon: "/logofavicon.jpg",
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicLayoutWrapper showHeaderFooter={false}>
      <div className={`${inter.className} ${dmSerifDisplay.variable} ${montserrat.variable}`}>
        {children}
      </div>
    </PublicLayoutWrapper>
  );
}
