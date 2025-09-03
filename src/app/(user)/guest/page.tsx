import Footer from "@/components/layout/Footer";
import Guest from "@/components/user/Guest/Guest";
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