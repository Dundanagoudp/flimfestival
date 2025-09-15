"use client";

import { getAboutStatistics, getIntroduction } from "@/services/aboutServices";
import { AboutIntroduction, AboutStatistics } from "@/types/aboutTypes";
import React, { useEffect ,useState} from "react";
import Reveal from "@/components/common/Reveal";
import { LoadingSpinner } from "@/components/common/LoaderSpinner";

export default function AboutUsContent() {
  const [stats, setStats] = useState<AboutStatistics | null>(null)
  const [introduction, setIntroduction] = useState<AboutIntroduction | null>(null)
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try{
      const response = await getAboutStatistics();
      setStats(response);
      }catch(error){
        console.log("error", error);
        setLoading(false);
      }finally{
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  useEffect(() => {
    const fetchIntroduction = async () => {
      setLoading(true);
      try{
        
      const response = await getIntroduction();
      setIntroduction(response);
        
   
      }catch(error){
        console.log("error", error);
        setLoading(false);
      }finally{
        setLoading(false);
      }
    };
    fetchIntroduction();
  }, []);
  const imgs = stats?.image ? [stats.image, stats.image] : [];
  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <LoadingSpinner />
      </div>
    );
  }
  //aboutus
  return (
      <section className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="space-y-10">
          {/* First Row: Image + Title & Description */}
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="h-[180px] sm:h-[220px] md:h-[260px] rounded-2xl overflow-hidden ring-1 ring-gray-300/70 bg-white">
                {imgs[0] ? (
                  <img src={imgs[0]} alt="Left top" className="h-full w-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
            </div>
            <div className="lg:col-span-7">
              <h2 className="font-montserrat font-extrabold text-3xl leading-tight text-gray-900 sm:text-4xl md:text-3xl">
                {introduction?.title ?? "Norem ipsum dolor sit a met consectetur"}
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-gray-600">
                {introduction?.description ??
                  "Worem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus."}
              </p>
            </div>
          </div>

          {/* Second Row: Image + Stats */}
          <Reveal delay={0.1} y={-10} transition={{ type: 'spring', stiffness: 90, damping: 18, mass: 0.8 }}>
            <div className="grid items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <div className="h-[180px] sm:h-[220px] md:h-[260px] rounded-2xl overflow-hidden ring-1 ring-gray-300/70 bg-white">
                  {imgs[1] ? (
                    <img src={imgs[1]} alt="Left bottom" className="h-full w-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
              </div>
              <div className="lg:col-span-7">
                {/* Main Stat */}
                <div className="flex items-center gap-6">
                  <div className="font-montserrat text-6xl font-extrabold leading-none" style={{ color: "#cdb84f" }}>
                    {stats?.films ?? 500}+
                  </div>
                  <div className="h-[2px] flex-1 translate-y-1.5 bg-gray-300" />
                </div>
                <p className="mt-3 text-xs text-gray-600">Videos created</p>

                {/* Secondary Stats */}
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
          </Reveal>
        </div>
      </div>
    </section>
  );
}
