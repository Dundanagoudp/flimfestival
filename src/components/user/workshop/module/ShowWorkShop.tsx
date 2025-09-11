"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Workshop } from "@/types/workShopTypes";
import React, { useEffect, useState } from "react";
import { getWorkshops } from "@/services/workshopService";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/common/Reveal";
import { LoadingSpinner } from "@/components/common/LoaderSpinner";

export default function ShowWorkShop() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);



  useEffect(() => {
    const fetchWorkshops = async () => {
      setLoading(true);
      try {
        const res = await getWorkshops();
        setWorkshops(res);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching workshops:", error);
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (workshops.length === 0) {
    return <div className="p-6 text-center">No workshops available</div>;
  }

  return (
    <main className="w-full px-4 bg-white">
      <div className="px-10 py-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workshops.map((workshop) => (
          <Reveal
            key={workshop._id}
            delay={0.1}
            y={-10}
            transition={{
              type: "spring",
              stiffness: 90,
              damping: 18,
              mass: 0.8,
            }}
          >
            <Card
              key={workshop._id}
              className="overflow-hidden shadow-md rounded-2xl hover:scale-102 transition-all duration-300"
            >
              <div className="relative w-full h-48">
                <Image
                  src={workshop?.imageUrl || "/event.png"}
                  alt={workshop?.name || "Workshop image"}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-2">{workshop?.name}</h2>
                <p className="text-sm text-gray-600 mb-4">{workshop?.about}</p>
                <div className="flex items-center gap-2">
                  <Link
                    href={workshop?.registrationFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full rounded-full bg-primary text-black hover:bg-yellow-300 hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out">
                      Register
                    </Button>
                  </Link>
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary animate-pulse hover:animate-bounce cursor-pointer">
                    <ArrowRight className="h-3 w-3 text-black" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
