import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getMediaUrl } from "@/utils/media";
export default function Contact() {


  return (
    <section className="w-full bg-[#eeeeee]">
      <div className="px-6 py-12">
        <h2 className="text-4xl md:text-6xl font-bold mb-8">
          We Welcome Submissions
        </h2>

        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:gap-8">
          {/* Left image */}
          <div className="w-full md:max-w-[520px]">
            <img
              src="video.png"
              alt="Film festival ceremony"
              width={520}
              height={300}
              className="h-[300px] w-full rounded-xl object-cover shadow-md md:h-[260px]"
              draggable={false}
            />
          </div>

          {/* Right content */}
          <div className="relative w-full text-gray-700">
            {/* Decorative top rule + double quotes aligned right */}
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-300" />
              <span aria-hidden className="-mt-2 text-4xl leading-none text-gray-300">
                {"”"}
              </span>
            
            </div>

            <div className="text-justify leading-relaxed">
              <p>
                Over the years, the Arunachal Film Festival has evolved into a significant cultural event, drawing
                filmmakers and audiences from all corners of the world. Our journey has been defined by captivating
                screenings, thought-provoking discussions, and unforgettable moments with some of the brightest talents
                in modern cinema.
              </p>
              <p className="mt-4">
                Looking ahead, we are thrilled to continue our mission of offering a platform for both emerging and
                established filmmakers, presenting the finest in independent cinema to an audience eager for innovative
                storytelling and unique perspectives.
              </p>
              <p className="mt-4">
                Join us as we step into the next phase of our cinematic journey, celebrating the art of film and the
                boundless potential of storytelling.
              </p>
            </div>

            {/* Call to action + small decorative circle */}
            <div className="mt-6 flex items-center gap-3">
              <Link href="/contactus">
                <Button className="rounded-full bg-primary px-6 py-2 text-black shadow-sm hover:bg-yellow-300 hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out">
                  Contact Us
                </Button>
              </Link>
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary animate-pulse hover:animate-bounce cursor-pointer">
                <ArrowRight className="h-3 w-3 text-black" />
              </span>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
