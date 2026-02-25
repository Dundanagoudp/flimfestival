'use client'

import React from 'react'

/**
 * Hero section – content and media are configurable via props.
 * Admin can edit: heroSubtitle (festival number), heroTitle, heroDate, videoUrl, posterUrl.
 */

export interface HeroSectionProps {
  /** Festival number (e.g. "11th") – editable from admin */
  heroSubtitle?: string
  /** Main title (e.g. "Arunachal Film Festival") – editable from admin */
  heroTitle?: string
  /** Date line – editable from admin */
  heroDate?: string
  /** Background video URL – upload from admin */
  videoUrl?: string
  videoUrlWebm?: string
  /** Poster/fallback image while video loads */
  posterUrl?: string
}

const DEFAULT_SUBTITLE = '11th'
const DEFAULT_TITLE = 'Arunachal Film Festival'
const DEFAULT_DATE = '6th - 8th March, 2026'
const DEFAULT_VIDEO_MP4 = '/HeroVideo.mp4'
const DEFAULT_VIDEO_WEBM = '/HeroVideo.webm'
const FESTIVAL_GOLD = '#f4b400'

/** Split title into first word and rest for two-line poster layout */
function splitTitle(title: string): { line1: string; line2: string } {
  const parts = title.trim().split(/\s+/)
  if (parts.length === 0) return { line1: '', line2: '' }
  if (parts.length === 1) return { line1: parts[0].toUpperCase(), line2: '' }
  const line1 = parts[0].toUpperCase()
  const line2 = parts.slice(1).join(' ').toUpperCase()
  return { line1, line2 }
}

const HeroSection = ({
  heroSubtitle = DEFAULT_SUBTITLE,
  heroTitle = DEFAULT_TITLE,
  heroDate = DEFAULT_DATE,
  videoUrl = DEFAULT_VIDEO_MP4,
  videoUrlWebm = DEFAULT_VIDEO_WEBM,
  posterUrl,
}: HeroSectionProps) => {
  const { line1: titleLine1, line2: titleLine2 } = splitTitle(heroTitle)

  return (
    <section
      className="w-full min-h-[780px] sm:min-h-screen sm:h-screen relative overflow-hidden mt-10 sm:mt-0"
      aria-label="Hero"
    >
      {/* Video background – unchanged */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={posterUrl || undefined}
        aria-hidden="true"
      >
        <source src={videoUrl} type="video/mp4" />
        {videoUrlWebm && <source src={videoUrlWebm} type="video/webm" />}
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay – unchanged */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        aria-hidden="true"
      />

      {/* Content – left-aligned text on black panel, stacked vertically */}
      <div className="absolute inset-0 flex items-center justify-start px-6 sm:px-10 md:px-16 lg:px-20 pt-20 md:pt-28">
        <div
          className="hero-text-reveal px-8 py-10 md:px-12 md:py-14 max-w-2xl md:max-w-3xl flex flex-col text-left gap-3 md:gap-4"
          aria-hidden="false"
        >
          {/* 11th Edition – white */}
          <p className="text-white text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium tracking-wide">
            {heroSubtitle} Edition
          </p>
          {/* ARUNACHAL / FILM FESTIVAL – large, bold, uppercase white, two lines */}
          <h1 className="font-bold text-white uppercase leading-[1.05] tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            <div>{titleLine1}</div>
            {titleLine2 && <div className="tracking-wider">{titleLine2}</div>}
          </h1>
          {/* Date – golden */}
          <p
            className="text-base md:text-lg lg:text-xl font-medium uppercase tracking-widest"
            style={{ color: FESTIVAL_GOLD }}
          >
            {heroDate}
          </p>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
