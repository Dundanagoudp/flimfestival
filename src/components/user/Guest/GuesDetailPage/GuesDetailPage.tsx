"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getGuestById, getAllGuests } from "@/services/guestService";
import type { Guest } from "@/types/guestTypes";

type UIItem = {
  id: string;
  name: string;
  role: string;
  photo: string;
};

export default function GuestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [allGuests, setAllGuests] = useState<UIItem[]>([]);
  const [loadingMore, setLoadingMore] = useState(true);

  // fetch current guest
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getGuestById(id);
        if (!mounted) return;
        setGuest(data);
      } catch (e: any) {
        setError(e?.message || "Failed to load guest");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  // fetch all guests once (for cards)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingMore(true);
        const res = await getAllGuests();
        // normalize array
        const arr: any[] = Array.isArray(res)
          ? res
          : Array.isArray((res as any)?.data)
          ? (res as any).data
          : [];

        const mapped: UIItem[] = arr.map((g: any) => ({
          id: g?._id ?? g?.id ?? crypto.randomUUID(),
          name: g?.name ?? "",
          role: g?.role ?? "Guest",
          photo: typeof g?.photo === "string" ? g?.photo : g?.photo?.url ?? "",
        }));
        if (!mounted) return;
        setAllGuests(mapped);
      } finally {
        if (mounted) setLoadingMore(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // pick 4 suggestions excluding current id
  const suggestions = useMemo(
    () => allGuests.filter((g) => g.id !== id).slice(0, 4),
    [allGuests, id]
  );

  if (loading) {
    return (
      <section className="bg-[oklch(0.97_0_0)]">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="h-72 w-full animate-pulse rounded-2xl bg-muted" />
        </div>
      </section>
    );
  }

  if (error || !guest) {
    return (
      <section className="bg-[oklch(0.97_0_0)]">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            {error || "Guest not found."}
          </div>
          <button
            className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
            onClick={() => router.push("/guests")}
          >
            Back to Guests
          </button>
        </div>
      </section>
    );
  }

  const photo =
    typeof (guest as any).photo === "string"
      ? (guest as any).photo
      : (guest as any).photo?.url ?? "/placeholder.png";

  const role = (guest as any).role ?? "Guest";
  const name = (guest as any).name ?? "";
  const age = (guest as any).age ?? "";
  const description = (guest as any).description ?? "";

  return (
    <section className="bg-[oklch(0.97_0_0)]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Top: selected guest hero (Film Director style) */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl ring-1 ring-border/70 md:aspect-[4/3]">
            <Image
              src={photo}
              alt={name}
              fill
              className="object-cover"
              sizes="(min-width:1024px) 50vw, 100vw"
              priority
            />
          </div>

          <div className="flex flex-col">
            <p className="text-md font-medium text-primary">{role}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {name}
            </h1>
            {age && (
              <p className="mt-1 text-muted-foreground">
                <span className="font-medium">Age:</span> {age}
              </p>
            )}
            {description && (
              <p className="mt-4 leading-7 text-foreground/90">{description}</p>
            )}
            {/* <div className="mt-6">
              <button
                className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
                onClick={() =>
                  history.length > 1 ? router.back() : router.push("/guests")
                }
              >
                Back
              </button>
            </div> */}
          </div>
        </div>

        {/* Below: four guest cards (navigate to their /guests/[id]) */}
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">More Guests</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loadingMore && !suggestions.length
              ? Array.from({ length: 4 }).map((_, i) => (
                  <article
                    key={i}
                    className="relative overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/70"
                  >
                    <div className="relative aspect-[4/5] w-full bg-muted animate-pulse" />
                  </article>
                ))
              : suggestions.map((g) => (
                  <Link
                    key={g.id}
                    href={`/guest/guests/${g.id}`}
                    className="group relative overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/70 focus:outline-none focus:ring-2 focus:ring-primary"
                    prefetch
                  >
                    <div className="relative aspect-[4/5] w-full">
                      <Image
                        src={g.photo || "/placeholder.png"}
                        alt={g.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-sm font-medium text-white">{g.name}</p>
                      <p className="text-xs text-white/80">{g.role}</p>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
