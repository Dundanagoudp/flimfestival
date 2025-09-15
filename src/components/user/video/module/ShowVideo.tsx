"use client";
import { LoadingSpinner } from "@/components/common/LoaderSpinner";
import Reveal from "@/components/common/Reveal";
import { getVideoBlog } from "@/services/videosServices";
import React, { useEffect, useState } from "react";

function getYouTubeVideoId(youtubeUrl?: string): string | null {
  if (!youtubeUrl) return null;
  const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const match = youtubeUrl.match(regex);
  if (match && match[1]) return match[1];
  try {
    const url = new URL(youtubeUrl);
    const v = url.searchParams.get("v");
    if (v && v.length === 11) return v;
  } catch { }
  return null;
}

function getYouTubeThumbnail(youtubeUrl?: string): string | undefined {
  const id = getYouTubeVideoId(youtubeUrl);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : undefined;
}

export default function ShowVideo() {
  const [videoBlog, setVideoBlog] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"video" | "youtube">("video");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  useEffect(() => {
    const fetchVideoBlog = async () => {
      setLoading(true);
      try {
        const res = await getVideoBlog();
        setVideoBlog(res?.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setLoading(false);
      }
    };
    fetchVideoBlog();
  }, []);

  const filteredVideos = videoBlog.filter((v) => v.videoType === activeTab);
  const selectedVideo =
    selectedIndex !== null ? filteredVideos[selectedIndex] : null;

  useEffect(() => {
    // Close modal when switching tabs or when list length changes
    setSelectedIndex(null);
  }, [activeTab, filteredVideos.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
    };
    if (selectedIndex !== null) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex]);
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="w-full bg-white">
      <main className="container mx-auto px-4 py-10">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(["video", "youtube"] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                    }`}
                >
                  {tab === "video" ? (
                    <svg
                      className="w-5 h-5"
                      fill={isActive ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill={isActive ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill={isActive ? "currentColor" : "gray"}
                        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                      />
                    </svg>
                  )}
                  <span>{tab === "video" ? "Videos" : "YouTube"}</span>
                </button>

              );
            })}
          </div>
        </div>

        {/* YouTube Home-style Grid */}
        <div className="relative">
          <Reveal
            key={`${activeTab}-${filteredVideos.length}`}
            delay={0.1}
            y={-10}
            transition={{
              type: "spring",
              stiffness: 90,
              damping: 18,
              mass: 0.8,
            }}
          >
            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVideos.map((video, idx) => (
                  <button
                    key={video._id}
                    onClick={() => setSelectedIndex(idx)}
                    className="group text-left"
                  >
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          (activeTab === "youtube" || video.youtubeUrl)
                            ? (getYouTubeThumbnail(video.youtubeUrl) || video.imageUrl)
                            : video.imageUrl
                        }
                        alt={video.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                        {new Date(video.addedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className="font-semibold leading-snug line-clamp-2">
                        {video.title}
                      </div>
                      {video.description ? (
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {video.description}
                        </div>
                      ) : null}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center w-full py-20">
                <p className="text-gray-500 text-lg">No {activeTab === "video" ? "videos" : "YouTube videos"} available</p>
              </div>
            )}
          </Reveal>
        </div>

        {/* Modal Player */}
        {selectedVideo ? (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={() => setSelectedIndex(null)}
          >
            <div className="absolute inset-0 bg-black/80" />
            <div
              className="relative z-10 w-[92vw] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                {activeTab === "video" ? (
                  <video
                    key={selectedVideo._id}
                    src={selectedVideo.video_url}
                    poster={selectedVideo.imageUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <iframe
                    key={selectedVideo._id}
                    src={
                      selectedVideo.youtubeUrl
                        ?.replace("watch?v=", "embed/") + "?autoplay=1&rel=0"
                    }
                    title={selectedVideo.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute -top-10 right-0 text-white/80 hover:text-white"
                aria-label="Close"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.3 5.71L12 12.01l-6.3-6.3-1.4 1.41 6.29 6.29-6.29 6.29 1.4 1.41 6.3-6.3 6.29 6.3 1.41-1.41-6.3-6.29 6.3-6.29z" />
                </svg>
              </button>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
