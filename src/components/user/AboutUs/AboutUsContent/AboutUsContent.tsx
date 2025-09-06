"use client";

import { getAboutStatistics, getIntroduction } from "@/services/aboutServices";
import { AboutIntroduction, AboutStatistics } from "@/types/aboutTypes";
import React, { useEffect ,useState} from "react";

export default function AboutUsContent() {
  const [stats, setStats] = useState<AboutStatistics | null>(null)
  const [introduction, setIntroduction] = useState<AboutIntroduction | null>(null)
  useEffect(() => {
    const fetchStats = async () => {
      const response = await getAboutStatistics();
      setStats(response);
      console.log(response);
    };
    fetchStats();
  }, []);
  useEffect(() => {
    const fetchIntroduction = async () => {
      const response = await getIntroduction();
      setIntroduction(response);
      console.log("introduction", response);
    };
    fetchIntroduction();
  }, []);
  const imgs = stats?.image ? [stats.image, stats.image] : [];
  return (
      <section className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-12">
          {/* Left: two stacked images */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="h-[180px] sm:h-[220px] md:h-[260px] rounded-2xl overflow-hidden ring-1 ring-gray-300/70 bg-white">
              {imgs[0] ? (
                <img src={imgs[0]} alt="Left top" className="h-full w-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>

            <div className="h-[180px] sm:h-[220px] md:h-[260px] rounded-2xl mt-18 overflow-hidden ring-1 ring-gray-300/70 bg-white">
              {imgs[0] ? (
                <img src={imgs[1]} alt="Left bottom" className="h-full w-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
          </div>

          {/* Right: headline + copy + metrics */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="font-montserrat font-extrabold text-3xl leading-tight text-gray-900 sm:text-4xl md:text-3xl">
                {introduction?.title ?? "Norem ipsum dolor sit a met consectetur"}
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-gray-600">
                {introduction?.description ??
                  "Worem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus."}
              </p>
            </div>

            {/* Metrics */}
            <div className="mt-18">
              <div className="flex items-center gap-6">
                <div className="font-montserrat text-6xl font-extrabold leading-none" style={{ color: "#cdb84f" }}>
                  {stats?.films ?? 500}+
                </div>
                <div className="h-[2px] flex-1 translate-y-1.5 bg-gray-300" />
              </div>
              <p className="mt-3 text-xs text-gray-600">Videos created</p>

              <div className="mt-10 grid gap-10 sm:grid-cols-2">
                <div>
                  <div className="font-montserrat text-4xl font-extrabold leading-none text-gray-900">
                    {stats?.years ?? 500}+
                  </div>
                  <div className="mt-3 h-[2px] w-full bg-gray-300" />
                  <p className="mt-2 text-xs text-gray-600">Years of Festival</p>
                </div>

                <div>
                  <div className="font-montserrat text-4xl font-extrabold leading-none text-gray-900">
                    {stats?.countries ?? 500}+
                  </div>
                  <div className="mt-3 h-[2px] w-full bg-gray-300" />
                  <p className="mt-2 text-xs text-gray-600">Countries Participated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
