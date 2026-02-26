import { Navbar } from "@/components/user/Home/navbar/Navbar"
import Footer from "@/components/user/Home/footer/Footer"
import GlimpsesPage from "@/components/user/Glimpses/GlimpsesPage"

export default function GlimpsesRoutePage() {
  return (
    <div className="-mt-[4rem] md:-mt-[10rem]" style={{ backgroundColor: "#ffffff" }}>
      <GlimpsesPage />
    </div>
  )
}
