
import GuestHero from "@/components/user/Guest/GuesDetailPage/module/GuestHero";
import Guest from "@/components/user/Guest/Guest";
import Footer from "@/components/user/Home/footer/Footer";
import HeroSection from "@/components/user/Home/hero/Herosection";
import React from "react";
export default function Page() {
    return (
        <div className="-mt-[10rem]" style={{ backgroundColor: '#EEEEEE' }}>
            
             <GuestHero/>
            <Guest />
       
        </div>
    );
}