"use client"
import Link from "next/link"

export default function ShowNotFound() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top right gradient circle */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-500 to-purple-700 rounded-full opacity-20 transform translate-x-32 -translate-y-32"></div>

        {/* Various floating circles */}
        <div className="absolute top-20 right-32 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-60"></div>
        <div className="absolute top-40 right-20 w-8 h-8 bg-purple-300 rounded-full opacity-40"></div>
        <div className="absolute bottom-32 right-40 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full opacity-50"></div>
        <div className="absolute top-32 left-20 w-6 h-6 bg-purple-200 rounded-full opacity-30"></div>
        <div className="absolute bottom-40 left-32 w-10 h-10 bg-purple-400 rounded-full opacity-40"></div>

        {/* Additional floating elements for premium feel */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-50"></div>
        <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-60"></div>
      </div>

      <div className="text-center z-10 relative">
        {/* Sorry message */}
        <h1 className="text-gray-600 text-lg font-medium mb-8 tracking-wide">SORRY, PAGE NOT FOUND</h1>

        {/* 404 with central design */}
        <div className="relative mb-12">
          {/* Large 404 text in background */}
          <div className="text-[12rem] md:text-[16rem] font-bold text-primary leading-none select-none">404</div>

          {/* Central circular element */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
                {/* Outer ring with pulse animation */}
                <svg width="120" height="120" className="absolute inset-0 animate-pulse">
                  <circle cx="60" cy="60" r="55" fill="none" stroke="url(#ringGradient)" strokeWidth="3" opacity="0.6" />
                  <defs>
                    <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Inner circle with gradient and hover effects */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 flex items-center justify-center relative overflow-hidden shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 hover:scale-110 cursor-pointer">
                  {/* Stars/dots inside with subtle animation */}
                  <svg width="96" height="96" className="absolute inset-0">
                    <circle cx="30" cy="25" r="1.5" fill="white" opacity="0.8" className="animate-ping" style={{ animationDelay: '0s' }} />
                    <circle cx="65" cy="35" r="1" fill="white" opacity="0.6" className="animate-ping" style={{ animationDelay: '0.5s' }} />
                    <circle cx="45" cy="50" r="1.5" fill="white" opacity="0.9" className="animate-ping" style={{ animationDelay: '1s' }} />
                    <circle cx="25" cy="65" r="1" fill="white" opacity="0.7" className="animate-ping" style={{ animationDelay: '1.5s' }} />
                    <circle cx="70" cy="70" r="1.5" fill="white" opacity="0.8" className="animate-ping" style={{ animationDelay: '2s' }} />
                    <circle cx="55" cy="25" r="1" fill="white" opacity="0.5" className="animate-ping" style={{ animationDelay: '2.5s' }} />
                  </svg>

                  {/* Small floating element with animation */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full animate-bounce shadow-lg"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to home button with premium effects */}
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-purple-600 to-purple-800 text-white font-medium px-8 py-3 rounded-full transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 hover:-translate-y-1 group relative overflow-hidden"
          >
            <span className="relative z-10">BACK TO HOME</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-0 group-hover:scale-100"></div>
          </Link>
        </div>
    </div>
  )
}
