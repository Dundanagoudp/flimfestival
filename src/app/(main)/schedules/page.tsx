import { Navbar } from "@/components/user/Home/navbar/Navbar";
import Footer from "@/components/user/Home/footer/Footer";
import Schedulepage from "@/components/user/schedulecomponents/schedulepage";

export default function SchedulesPage() {
  return (
    <div className="-mt-[10rem]" style={{ backgroundColor: "#ffffff" }}>
      <Navbar />
      <Schedulepage />
      <Footer />
    </div>
  );
}
