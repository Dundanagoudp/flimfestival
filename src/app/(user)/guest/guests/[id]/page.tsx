
import GuestDetailPage from "@/components/user/Guest/GuesDetailPage/GuesDetailPage";
import Footer from "@/components/user/Home/footer/Footer";
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
