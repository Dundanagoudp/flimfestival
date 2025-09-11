
import GuestDetailPage from "@/components/user/Guest/GuesDetailPage/GuesDetailPage";
import GuestHero from "@/components/user/Guest/GuesDetailPage/module/GuestHero";
import Footer from "@/components/user/Home/footer/Footer";
import { Navbar } from "@/components/user/Home/navbar/Navbar";

export default function Page() {
  return (
    <div className="-mt-[10rem]" style={{ backgroundColor: '#EEEEEE' }}>
      <GuestHero/>
      <GuestDetailPage />   {/* only the film-director style section + “More Guests” grid */}
   
    </div>
  );
}
