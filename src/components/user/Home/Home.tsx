"use client";

import React, { useEffect, useState } from "react";
import HeroSection from "./hero/Herosection";
import NewsTicker from "./newsTicker/NewsTicker";
import AboutSection from "./about/AboutSection";
import AboutItems from "./about/newaboutpage/AboutItems";
import VideoSection from "./videosection/VideoSection";
import EventSchedule from "./eventSchedule/EventSchedule";
import Guest from "./guest/Guest"
import AwardNomination from "./award/AwardNomination"
import Gallery from "./Gallery/Gallery"
import Shortfilm from "./officialSection/Shortfilm"
import Documentaryfilm from "./officialSection/Documentaryfilm"
import JurySection from "./officialSection/jurySection"
import OfficialSection from "./officialSection/OfficialSection"
import BlogsAndMedia from "./blog&media/BlogsAndMedia"
import Contact from "./contact/Contact"
import YearAward from "./yearWiseAward/YearAward"
import Reveal from "@/components/common/Reveal"
import { getHeroBanner } from "@/services/heroBannerService"
import type { HeroBanner } from "@/types/heroBannerTypes"
import { getMediaUrl } from "@/utils/media"

function mapHeroToProps(banner: HeroBanner | null) {
  if (!banner) return undefined;
  const parts = (banner.title || "").trim().split(/\s+/);
  const heroSubtitle = parts.length > 0 ? parts[0] : undefined;
  const heroTitle = parts.length > 1 ? parts.slice(1).join(" ") : banner.title;
  return {
    heroSubtitle,
    heroTitle: heroTitle || banner.title,
    heroDate: banner.subtitle,
    videoUrl: banner.video ? getMediaUrl(banner.video) : undefined,
    videoUrlWebm: undefined,
    posterUrl: undefined,
  };
}

export default function Home() {
  const [heroBanner, setHeroBanner] = useState<HeroBanner | null>(null);

  useEffect(() => {
    let cancelled = false;
    getHeroBanner()
      .then((data) => {
        if (!cancelled) setHeroBanner(data ?? null);
      })
      .catch(() => {
        if (!cancelled) setHeroBanner(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const heroProps = mapHeroToProps(heroBanner);

  return (
    <>
      <div className="-mt-[10rem]" style={{ backgroundColor: "#ffffff" }}>
      <Reveal y={32}><HeroSection {...heroProps} /></Reveal>
      <NewsTicker />
      <Reveal transition={{ type: 'tween', duration: 0.8, ease: [0.22, 1, 0.36, 1] }}><AboutSection/></Reveal>
      <Reveal y={32} delay={0.1}><VideoSection/></Reveal>
      <Reveal y={32} delay={0.15} transition={{ type: 'spring', stiffness: 140, damping: 16 }}><EventSchedule/></Reveal>
      <Reveal y={32} delay={0.15} transition={{ type: 'spring', stiffness: 140, damping: 16 }}><Guest/></Reveal>
      {/* <Reveal y={32} delay={0.15} transition={{ type: 'spring', stiffness: 140, damping: 16 }}><AwardNomination/></Reveal> */}
      <Reveal y={32} delay={0.32}><Shortfilm/></Reveal>
      <Reveal y={32} delay={0.33}><Documentaryfilm/></Reveal>
      <Reveal y={32} delay={0.3} transition={{ type: 'tween', duration: 1.1, ease: 'easeOut' }}><Gallery/></Reveal>
      <Reveal y={32} delay={0.34}><JurySection/></Reveal>
      <Reveal y={32} delay={0.35}><OfficialSection/></Reveal>
      <Reveal y={32} delay={0.36}><BlogsAndMedia/></Reveal>
      <Reveal y={32} delay={0.4}><Contact/></Reveal>
      <Reveal y={32} delay={0.45}><YearAward/></Reveal>
  
      </div>
    </>
  )
}
