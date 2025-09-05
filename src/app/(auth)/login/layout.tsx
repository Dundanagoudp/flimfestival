import { ToastProvider } from "@/components/ui/custom-toast";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
      <ToastProvider>
        {children}
      </ToastProvider>
    );
  } 