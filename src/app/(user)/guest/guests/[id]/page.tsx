import Footer from "@/components/layout/Footer";
import GuestDetailPage from "@/components/user/Guest/GuesDetailPage/GuesDetailPage";
import { Navbar } from "@/components/user/Home/navbar/Navbar";

export default function Page() {
  return (
    <>
    <Navbar />
      <GuestDetailPage />   {/* only the film-director style section + “More Guests” grid */}
      <Footer />
    </>
  );
}
