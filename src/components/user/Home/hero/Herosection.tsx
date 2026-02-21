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
const DEFAULT_DATE = '6th – 8th February, 2026'
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

      {/* Content – flex: top row (11th + title same row), then date below; vertically centered; top padding */}
      <div className="absolute inset-0 flex items-center justify-start px-10 md:px-20 pt-16 md:pt-32">
        <div className="hero-text-reveal max-w-5xl w-full flex flex-col text-center md:text-left">
          {/* Top row: 11th and title in same row on desktop; column on mobile */}
          <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-10">
            <div className="font-extrabold text-white leading-none shrink-0 text-[60px] md:text-[90px] lg:text-[140px]">
              {heroSubtitle}
            </div>
            <h1 className="font-bold text-white uppercase leading-[1.1] tracking-wide shrink-0 text-[28px] md:text-[48px] lg:text-[70px]">
              <div>{titleLine1}</div>
              {titleLine2 && <div>{titleLine2}</div>}
            </h1>
          </div>
          {/* Date – full width below top row */}
          <div
            className="mt-6 md:mt-8 w-full text-base md:text-[22px] lg:text-[32px] font-medium uppercase tracking-[0.2em] md:tracking-[0.15em]"
            style={{ color: FESTIVAL_GOLD }}
          >
            {heroDate}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
