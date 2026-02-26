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
  heroSubtitle,
  heroTitle,
  heroDate,
  videoUrl = DEFAULT_VIDEO_MP4,
  videoUrlWebm = DEFAULT_VIDEO_WEBM,
  posterUrl,
}: HeroSectionProps) => {
  const subtitle = heroSubtitle ?? DEFAULT_SUBTITLE
  const title = heroTitle ?? DEFAULT_TITLE
  const date = heroDate ?? DEFAULT_DATE
  const { line1: titleLine1, line2: titleLine2 } = splitTitle(title)

  return (
    <section
      className="w-full min-h-[780px] sm:min-h-screen sm:h-screen relative overflow-hidden mt-10 sm:mt-0"
      aria-label="Hero"
    >
      {/* Fallback video background – plays immediately, behind YouTube */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ background: 'hsl(30 10% 8%)' }}
        aria-hidden="true"
      >
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videoplayback.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      </div>

      {/* YouTube video background – full-bleed cover, on top when loaded */}
      <div
        className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
        style={{ background: 'hsl(30 10% 8%)' }}
        aria-hidden="true"
      >
        <iframe
          src="https://www.youtube.com/embed/f3J2oXrq-WE?autoplay=1&mute=1&loop=1&playlist=f3J2oXrq-WE&controls=0&showinfo=0"
          style={{
            border: 'none',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'calc(max(177.78vh, 100vw) + 100px)',
            height: 'calc(max(100vh, 56.25vw) + 100px)',
          }}
          allow="autoplay; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Background Video"
        />
      </div>

      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-[11]"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        aria-hidden="true"
      />

      {/* Content – above overlay so text is always visible */}
      <div className="absolute inset-0 z-20 flex items-center justify-start px-6 sm:px-10 md:px-16 lg:px-20 pt-20 md:pt-28">
        <div
          className="hero-text-reveal px-8 py-10 md:px-12 md:py-14 max-w-2xl md:max-w-3xl flex flex-col text-left gap-3 md:gap-4"
          aria-hidden="false"
        >
          {/* 11th Edition – white */}
          <p className="text-white text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-medium tracking-wide">
            {subtitle} Edition
          </p>
          {/* ARUNACHAL / FILM FESTIVAL – large, bold, uppercase white, two lines */}
          <h1 className="font-bold text-white uppercase leading-[1.05] tracking-tight text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl">
            <div>{titleLine1}</div>
            {titleLine2 && <div className="tracking-wider">{titleLine2}</div>}
          </h1>
          {/* Date – golden */}
          <p
            className="text-lg md:text-lg lg:text-xl font-medium uppercase tracking-widest"
            style={{ color: FESTIVAL_GOLD }}
          >
            {date}
          </p>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
