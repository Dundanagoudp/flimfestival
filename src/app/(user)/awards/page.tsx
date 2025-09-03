import Footer from "@/components/layout/Footer";
import { Awards } from "@/components/user/Awards/Awards";
import { ContactUs } from "@/components/user/ContactUs/ContactUs";
import React from "react";
export default function Page() {
    return (
        <div>
          <Awards />
          <Footer />
        </div>
    );
}