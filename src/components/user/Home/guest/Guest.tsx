'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getAllGuests } from '@/services/guestService';
import Link from 'next/link';
import { getMediaUrl } from '@/utils/media';
import GuestCarousel from './GuestCarousel';

function Guest() {
  const [guestData, setGuestData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuest = async () => {
      try {
        const response = await getAllGuests();
        setGuestData(response);
      } catch (err: any) {
        // keep loading false
      } finally {
        setLoading(false);
      }
    };
    fetchGuest();
  }, []);

  const displayGuests = guestData.slice(0, 6);

  if (loading) {
    return (
      <div className="w-full px-4">
        <div className="px-10 py-10">
          <div className="flex justify-center items-center h-96">
            <p className="text-lg">Loading guests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <main className="w-full px-4">
        <div className="px-3 sm:px-4 md:px-10 py-6 sm:py-8 md:py-10">
          <div className="flex flex-row items-center justify-between gap-3">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold shrink-0">Guest</h1>
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              <Link href="/guests">
                <Button className="rounded-full bg-primary text-black hover:bg-yellow-300 hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 h-auto">
                  View Guest
                </Button>
              </Link>
              <Link href="/guests" className="inline-flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary hover:opacity-90 transition-opacity">
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-black" />
              </Link>
            </div>
          </div>

          <div className="mt-6 md:mt-10 overflow-hidden bg-background">
            <GuestCarousel guests={displayGuests} getImageUrl={getMediaUrl} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Guest;
