import { ToastProvider } from "@/components/ui/custom-toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arunachal Film Festival - Login",
  description: "Login to Arunachal Film Festival",
  icons: {
    icon: "/govLogo.png",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
      <ToastProvider>
        {children}
      </ToastProvider>
    );
  } 