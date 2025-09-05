import { Manrope, DM_Serif_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/custom-toast";
import { AuthProvider } from "@/context/auth-context";
import type { Metadata } from "next";
import AdminLayoutWrapper from "@/components/publicLayoutWrapper";
const manrope = Manrope({ subsets: ["latin"] });
// const dmSerifDisplay = DM_Serif_Display({ 
//   weight: "400",
//   subsets: ["latin"],
//   variable: "--font-dm-serif-display"
// });
const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-montserrat"
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
      <body className={`${manrope.className}  ${montserrat.variable}`}>
        <AuthProvider>
          <ToastProvider>
            <AdminLayoutWrapper showHeaderFooter={true}>
              {children}
            </AdminLayoutWrapper>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
