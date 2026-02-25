"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Workshop } from "@/types/workshop-Types";
import type { GroupedWorkshopsResponse } from "@/types/workshop-Types";
import React, { useEffect, useState } from "react";
import { getWorkshopsGrouped } from "@/services/workshop-Services";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/common/Reveal";
import { LoadingSpinner } from "@/components/common/LoaderSpinner";
import { getMediaUrl } from "@/utils/media";
import { sanitizeUrl } from "@/lib/sanitize";

export default function ShowWorkShop() {
  const [grouped, setGrouped] = useState<GroupedWorkshopsResponse>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getWorkshopsGrouped()
      .then((res) => {
        if (!cancelled) setGrouped(Array.isArray(res) ? res : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Failed to load workshops");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  const hasAny = grouped.some((g) => g.workshops.length > 0);
  if (!hasAny) {
    return <div className="p-6 text-center">No workshops available</div>;
  }

  return (
    <main className="w-full px-4 bg-white">
      <div className="px-10 py-10 space-y-10">
        {grouped.map((item) => {
          if (item.workshops.length === 0) return null;
          const sectionTitle = item.category?.name ?? "Workshops";
          return (
            <section key={item.category?._id ?? "uncategorized"}>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {sectionTitle}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {item.workshops.map((workshop: Workshop) => (
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
                      className="overflow-hidden shadow-md rounded-2xl hover:scale-102 transition-all duration-300"
                    >
                      <div className="relative w-full h-48">
                        <Image
                          src={getMediaUrl(workshop?.imageUrl) || "/event.png"}
                          alt={workshop?.name || "Workshop image"}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{workshop?.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{workshop?.about}</p>
                        <div className="flex items-center gap-2">
                          <Link
                            href={sanitizeUrl(workshop?.registrationFormUrl || "") || "#"}
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
            </section>
          );
        })}
      </div>
    </main>
  );
}
