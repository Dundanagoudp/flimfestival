'use client'
import React, {  useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { getAllGuests } from '@/services/guestService'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
function Guest() {
 const [guestData, setGuestData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGuest = async () => {
      try {
        const response = await getAllGuests();
        setGuestData(response);
      } catch (err: any) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchGuest()
  }, [])
   const displayGuests = guestData.slice(0, 6)
    if (loading) {
    return (
      <div className="w-full px-4">
        <div className="px-10 py-10">
          <div className="flex justify-center items-center h-96">
            <p className="text-lg">Loading guests...</p>
          </div>
        </div>
      </div>
    )
  }
  return (
      <div>
      <main className="w-full px-4">
        <div className="px-4 md:px-10 py-8 md:py-10">
          <div className='flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center'>
            <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold'>Guest</h1>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href={"/guests"}>
                <Button className="rounded-full bg-primary text-black hover:bg-yellow-300 hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out">
                  View Guest
                </Button>
              </Link>
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary animate-pulse hover:animate-bounce cursor-pointer">
                <ArrowRight className="h-3 w-3 text-black" />
              </span>
            </div>
          </div>
          
          {/* Mobile: Swiper carousel */}
          <div className="px-1 sm:px-4 sm:hidden mt-6 md:mt-10">
            {displayGuests.length > 0 ? (
              <div className="w-full overflow-hidden rounded-lg">
                <Swiper
                  modules={[Autoplay]}
                  spaceBetween={12}
                  slidesPerView={1.1}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  loop
                  speed={650}
                >
                  {displayGuests.map((guest) => (
                    <SwiperSlide key={guest._id}>
                      <div className="relative cursor-pointer group transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl">
                        <img
                          src={guest.photo || "/video.png"}
                          alt={guest.name || 'Guest'}
                          className="w-full h-56 rounded-lg object-cover transition-all duration-300 ease-out group-hover:brightness-110"
                          loading="lazy"
                          decoding="async"
                          sizes="100vw"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/video.png";
                          }}
                        />
                        <div className="absolute inset-0 rounded-lg pointer-events-none bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute left-3 bottom-3 text-white pointer-events-none">
                          <h4 className="text-base font-semibold truncate max-w-[85%]">{guest.name}</h4>
                          <p className="text-xs opacity-90">{guest.role}</p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-base">No guests available</p>
              </div>
            )}
          </div>

          {/* Tablet/Desktop: Grid layout */}
          <div className="px-1 sm:px-4">
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-6 md:mt-10">
              {displayGuests.length > 0 && (
                <>
                  {/* Featured guest (top-left, larger) */}

                  <div className="relative cursor-pointer group transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl ">
                    <img
                      src={displayGuests[0]?.photo || "/video.png"}
                      alt={displayGuests[0]?.name || "Featured Guest"}
                      className="w-full h-56 sm:h-64 md:h-72 lg:h-96 rounded-lg object-cover transition-all duration-300 ease-out group-hover:brightness-110"
                      loading="lazy"
                      decoding="async"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/video.png"; // Fallback image
                      }}
                    />
                    {/* Gradient & text overlay */}
                    <div className="absolute inset-0 rounded-lg pointer-events-none bg-gradient-to-t from-black/65 via-black/30 to-transparent"></div>
                    <div className="absolute left-5 bottom-5 text-white pointer-events-none">
                      <h3 className="text-2xl md:text-3xl font-semibold leading-tight">
                        {displayGuests[0]?.name || "Guest Name"}
                      </h3>
                      <p className="text-sm md:text-base opacity-90 mt-1">
                        {displayGuests[0]?.role || "Role"} • {displayGuests[0]?.year || "Year"}
                      </p>
                    </div>
                  </div>

                  {/* Top row - right two thumbnails */}
                  {displayGuests[1] && (
                    <div className="relative cursor-pointer group transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl">
                      <img
                        src={displayGuests[1].photo || "/video.png"}
                        alt={displayGuests[1].name}
                        className="w-full h-56 sm:h-64 md:h-72 lg:h-96 rounded-lg object-cover transition-all duration-300 ease-out group-hover:brightness-110"
                        loading="lazy"
                        decoding="async"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/video.png";
                        }}
                      />
                      <div className="absolute inset-0 rounded-lg pointer-events-none bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="absolute left-3 bottom-3 text-white pointer-events-none">
                        <h4 className="text-lg font-semibold">{displayGuests[1].name}</h4>
                        <p className="text-xs opacity-90">{displayGuests[1].role}</p>
                      </div>
                    </div>
                  )}
                  
                  {displayGuests[2] && (
                    <div className="relative cursor-pointer group transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl">
                      <img
                        src={displayGuests[2].photo || "/video.png"}
                        alt={displayGuests[2].name}
                        className="w-full h-56 sm:h-64 md:h-72 lg:h-96 rounded-lg object-fill transition-all duration-300 ease-out group-hover:brightness-110"
                        loading="lazy"
                        decoding="async"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/video.png";
                        }}
                      />
                      <div className="absolute inset-0 rounded-lg pointer-events-none bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="absolute left-3 bottom-3 text-white pointer-events-none">
                        <h4 className="text-lg font-semibold">{displayGuests[2].name}</h4>
                        <p className="text-xs opacity-90">{displayGuests[2].role}</p>
                      </div>
                    </div>
                  )}

                  {/* Bottom row - 3 thumbnails */}
                  {displayGuests.slice(3, 6).map((guest) => (
                    <div key={guest._id} className="relative cursor-pointer group transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl">
                      <img
                        src={guest.photo || "/video.png"}
                        alt={guest.name}
                        className="w-full h-56 sm:h-64 md:h-72 lg:h-80 rounded-lg object-fill transition-all duration-300 ease-out group-hover:brightness-110"
                        loading="lazy"
                        decoding="async"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/video.png";
                        }}
                      />
                      <div className="absolute inset-0 rounded-lg pointer-events-none bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="absolute left-3 bottom-3 text-white pointer-events-none">
                        <h4 className="text-sm font-semibold">{guest.name}</h4>
                        <p className="text-xs opacity-90">{guest.role}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Fallback for when there are no guests */}
              {displayGuests.length === 0 && (
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-16 md:py-20">
                  <p className="text-lg text-gray-500">No guests available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Guest
