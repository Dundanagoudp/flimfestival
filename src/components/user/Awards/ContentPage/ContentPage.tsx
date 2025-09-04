"use client";

import Image from "next/image";
import React from "react";

export default function ContentPage() {
  return (
    <section className="bg-[oklch(0.97_0_0)]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          {/* Left: image */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-border/70 bg-card p-1 shadow-sm">
              <div className="overflow-hidden rounded-xl">
                <Image
                  src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1470&auto=format&fit=crop"
                  alt="Showcase"
                  width={1200}
                  height={1500}
                  className="h-[420px] w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right: content */}
          <div className="lg:col-span-7">
            {/* Big metric + horizontal rule */}
            <div className="flex items-center gap-6 mt-10">
              <div className="font-montserrat text-8xl font-extrabold leading-none text-primary">
                500+
              </div>
            </div>
            <div className="h-[2px] flex-1 translate-y-1.5 bg-border/80 mb-22" />
            {/* Two stats below */}
            <div className="mt-12  grid gap-12 sm:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="font-montserrat text-6xl font-extrabold leading-none text-foreground">
                    500+
                  </div>
                  <div className="h-[2px] w-full bg-border/80" />
                  <p className="text-xs text-muted-foreground">
                    Videos created
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
