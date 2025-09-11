import PublicLayoutWrapper from "@/components/publicLayoutWrapper";
import { ToastProvider } from "@/components/ui/custom-toast";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastProvider>
        {/* <PublicLayoutWrapper showHeaderFooter={true}> */}
          {children}
        {/* </PublicLayoutWrapper> */}
      </ToastProvider>
    </>
  );
} 