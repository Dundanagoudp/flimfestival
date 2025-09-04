
import Guest from "@/components/user/Guest/Guest";
import Footer from "@/components/user/Home/footer/Footer";
import HeroSection from "@/components/user/Home/hero/Herosection";
import React from "react";
export default function Page() {
    return (
        <div>
              <HeroSection />
            <Guest />
        <Footer />
        </div>
    );
}