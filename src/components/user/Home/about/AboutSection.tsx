import type React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

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

export default function AboutSection() {
  return (
    <main className="w-full px-4">
      <div className="px-10 py-10">
        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[30%_70%]  ">
          <div></div>

          {/* Right side About content */}
          <div className="flex flex-col justify-center">
            <section className="space-y-4">
              <h2 className="text-4xl font-bold">About AFF</h2>
              <p className="text-3xl text-[#989898] leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
                <br />
                Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s,
                <br />
                when an unknown printer took a galley of type and scrambled it
                to make a type specimen book.
              </p>
              <div className="flex items-center gap-2">
                <Button className="rounded-full bg-primary text-black hover:bg-yellow-300">
                  Read More
                </Button>
                <span
                  aria-hidden
                  className="inline-block h-4 w-4 rounded-full bg-primary"
                />
              </div>
            </section>
          </div>
        </div>

        {/* Features */}
        <section className="mt-16 grid gap-8 md:grid-cols-3">
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
        </section>

        {/* 4 Equal divisions across screen */}
        <section className="w-full flex flex-wrap justify-around  mt-10">
          <ImagePlaceholder />
          <ImagePlaceholder />
          <ImagePlaceholder />
          <ImagePlaceholder />
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] ">
          <div></div>
          <div>
            {/* Tags */}
            <section className="mt-10 flex items-center gap-3">
              <Button className="rounded-full bg-primary px-4 py-2 text-black hover:bg-yellow-300">
                Master Class
              </Button>
              <Button variant="secondary" className="rounded-full px-4 py-2">
                Workshop
              </Button>
            </section>

            {/* Master Class */}
            <section className="mt-4 space-y-4">
              <h2 className="text-4xl font-bold">Master Class</h2>
              <p className="text-3xl text-[#989898] leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and <br />
                typesetting industry. Lorem Ipsum has been the industry standard
                dummy text.
              </p>
              <div className="flex items-center gap-2">
                <Button className="rounded-full bg-primary text-black hover:bg-yellow-300">
                  Register
                </Button>
                <button
                  aria-label="go"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-black hover:bg-yellow-300"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
