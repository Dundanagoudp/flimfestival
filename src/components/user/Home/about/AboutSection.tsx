"use client";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getWorkshops } from "@/services/workshopService";
import { Workshop } from "@/types/workShopTypes";
import Image from "next/image";
import { getIntroduction } from "@/services/aboutServices";
import { AboutIntroduction } from "@/types/aboutTypes";

function Feature({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t pt-4">
      <h3 className="text-2xl ">{title}</h3>
      <p className="mt-2 text-base text-[#666666]">{children}</p>
    </div>
  );
}

function ImagePlaceholder() {
  return (
    <Card className="w-[270px] h-[277px] rounded-[10px] bg-muted" aria-hidden />
  );
}

function WorkshopCard({ workshop }: { workshop: Workshop }) {
  return (
<Card
  className="overflow-hidden rounded-[12px] shadow-sm 
             transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] 
             hover:scale-[1.03] hover:shadow-lg"
>
  <div className="relative w-full h-[220px] overflow-hidden">
    <Image
      src={workshop?.imageUrl || "/event.png"}
      alt={workshop?.name || "Workshop image"}
      fill
      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
      className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-110"
    />
  </div>
  <div className="p-3">
    <h3 className="text-base font-semibold truncate">{workshop?.name}</h3>
  </div>
</Card>

  );
}

export default function AboutSection() {
  const [workshopData, setWorkshopData] = useState<Workshop[]>([]);
  const [introduction, setIntroduction] = useState<AboutIntroduction>();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchWorkshops = async () => {
      setLoading(true);
      try {
        const response = await getWorkshops();
        setWorkshopData(response);
      } catch (err: any) {
        console.log(err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    void fetchWorkshops();
  }, []);
  useEffect(() => {
    const fetchIntroduction = async () => {
      setLoading(true);
      try {
        const response = await getIntroduction();
        console.log("response of Introduction", response);
        setIntroduction(response.data);
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchIntroduction();
  }, []);
  return (
    <main className="w-full px-4">
      <div className="px-10 py-10">
        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[30%_70%]  ">
          <div></div>

          {/* Right side About content */}
          <div className="flex flex-col justify-center">
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">
                {(introduction as any)?.title}
              </h2>
              <p className="text-xl text-[#989898] leading-[2.5rem] text-justify">
                {(introduction as any)?.description}
              </p>
              <div className="flex items-center gap-2 group">
                <Link href="/aboutus">
                  <Button className="rounded-full bg-primary text-black hover:bg-yellow-300 hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out">
                    Read More
                  </Button>
                </Link>
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary animate-pulse hover:animate-bounce cursor-pointer">
                  <ArrowRight className="h-3 w-3 text-black" />
                </span>
              </div>
            </section>
          </div>
        </div>

        {/* Features */}
        {/* <section className="mt-16 grid gap-8 md:grid-cols-3">
          <Feature title="Award winning projects">
            Lorem Ipsum is simply dummy text of the printing and <br />
            typesetting industry. Lorem Ipsum has been the industry
            <br />s standard dummy text ever since the 1500s
          </Feature>
          <Feature title="Award winning projects">
            Lorem Ipsum is simply dummy text of the printing and <br />
            typesetting industry. Lorem Ipsum has been the industry
            <br />s standard dummy text ever since the 1500s
          </Feature>
          <Feature title="Best quality products">
            Lorem Ipsum is simply dummy text of the printing and <br />
            typesetting industry. Lorem Ipsum has been the industry
            <br />s standard dummy text ever since the 1500s
          </Feature>
        </section> */}

        {/* Workshops grid */}
        <section
          className="w-full mt-10 grid gap-6 
             grid-cols-1 sm:grid-cols-2 
             md:grid-cols-3 lg:grid-cols-4 
             auto-rows-auto"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
          }}
        >

          {loading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <ImagePlaceholder  key={idx} />
              ))
            : workshopData.map((workshop) => (
                <WorkshopCard key={workshop._id} workshop={workshop}  />
              ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] ">
          <div></div>
          <div>
            {/* Tags */}
            {/* <section className="mt-10 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Link href="/workshop">
                  <Button className="rounded-full bg-primary px-4 py-2 text-black hover:bg-yellow-300 hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out">
                    Master Class
                  </Button>
                </Link>
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary animate-pulse hover:animate-bounce cursor-pointer">
                  <ArrowRight className="h-3 w-3 text-black" />
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" className="rounded-full px-4 py-2">
                  Workshop
                </Button>
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary animate-pulse hover:animate-bounce cursor-pointer">
                  <ArrowRight className="h-3 w-3 text-black" />
                </span>
              </div>
            </section> */}

            {/* Master Class */}
            <section className="mt-4 space-y-4">
              <h2 className="text-4xl font-bold">Master Class</h2>
              <p className="text-3xl text-[#989898] leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and <br />
                typesetting industry. Lorem Ipsum has been the industry standard
                dummy text.
              </p>
              <div className="flex items-center gap-2">
                <Link href="/workshop">
                  <Button className="rounded-full bg-primary text-black hover:bg-yellow-300 hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out">
                    Register
                  </Button>
                </Link>
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary animate-pulse hover:animate-bounce cursor-pointer">
                  <ArrowRight className="h-3 w-3 text-black" />
                </span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
