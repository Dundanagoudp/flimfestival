"use client";

import React from "react";

export default function ContentPage() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Title (left) + image (right) */}
        <div className="grid items-start gap-10 lg:grid-cols-12">
          {/* Multi-line headline (left) */}
          <div className="lg:col-span-6">
            <h3 className="font-montserrat text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
              <span className="block">Norem ipsum dolor</span>
              <span className="block">sit a met consectetur</span>
              <span className="block">Norem ipsum dolor</span>
              <span className="block">sit amet consectetur</span>
            </h3>
          </div>

          {/* Image placeholder (right) */}
          <div className="lg:col-span-6">
            <div className="h-[220px] rounded-2xl bg-muted ring-1 ring-border/70 sm:h-[260px] md:h-[300px]" />
          </div>
        </div>

        {/* Three text columns */}
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <p className="font-montserrat text-sm font-semibold text-foreground">
                Corem ipsum dolor sit amet
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Worem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie,
                dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem
                sollicitudin lacus, ut interdum tellus elit sed risus.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
