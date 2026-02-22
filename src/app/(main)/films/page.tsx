import { Navbar } from "@/components/user/Home/navbar/Navbar"
import Footer from "@/components/user/Home/footer/Footer"
import FilmsHero from "@/components/user/Films/FilmsHero"
import FilmsPageContent from "@/components/user/Films/FilmsPageContent"

export default function FilmsPage() {
  return (
    <div className="-mt-[10rem]" style={{ backgroundColor: "#ffffff" }}>
      <Navbar />
      <FilmsHero />
      <FilmsPageContent />
      <Footer />
    </div>
  )
}
