"use client";

import React from "react";

export default function AboutUsContent() {
  return (
    <section className="bg-[oklch(0.97_0_0)]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Image (left) + Headline & Metrics (right) */}
        <div className="grid items-start gap-10 lg:grid-cols-12">
          {/* Left: image beside headline */}
          <div className="lg:col-span-5">
            <div className="h-[260px] rounded-2xl bg-muted ring-1 ring-border/70 sm:h-[300px] md:h-[340px]" />
          </div>

          {/* Right: headline + copy + metrics */}
          <div className="lg:col-span-7 space-y-8">
            {/* Headline + intro copy */}
            <div>
              <h2 className="font-montserrat text-3xl font-extrabold leading-tight text-foreground sm:text-4xl md:text-3xl">
                Norem ipsum dolor sit a met consectetur Norem ipsum dolor
                sit amet consectetur Norem ipsum dolor sit amet consectetur
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-muted-foreground">
                Worem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie,
                dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem
                sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum
                velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per
                conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas,
                ac scelerisque ante pulvinar.
              </p>
            </div>

            {/* Metrics */}
            <div>
              {/* Big 500+ with horizontal rule */}
              <div className="flex items-center gap-6">
                <div className="font-montserrat text-6xl font-extrabold leading-none text-primary">
                  500+
                </div>
                <div className="h-[2px] flex-1 translate-y-1.5 bg-border/80" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Videos created</p>

              {/* Two smaller stats */}
              <div className="mt-10 grid gap-10 sm:grid-cols-2">
                {[1, 2].map((i) => (
                  <div key={i}>
                    <div className="font-montserrat text-4xl font-extrabold leading-none text-foreground">
                      500+
                    </div>
                    <div className="mt-3 h-[2px] w-full bg-border/80" />
                    <p className="mt-2 text-xs text-muted-foreground">Videos created</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
