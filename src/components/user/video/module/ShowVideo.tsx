"use client";
import { LoadingSpinner } from "@/components/common/LoaderSpinner";
import Reveal from "@/components/common/Reveal";
import { Card, CardContent } from "@/components/ui/card";
import { getVideoBlog } from "@/services/videosServices";
import { GetAllVideosResponse, VideoBlog } from "@/types/videosTypes";
import React, { useEffect, useState } from "react";

export default function ShowVideo() {
  const [videoBlog, setVideoBlog] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"video" | "youtube">("video");
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
                  className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  {tab === "video" ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  )}
                  <span>{tab === "video" ? "Videos" : "YouTube"}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards */}
        <div className="relative">
          <Reveal
            key={filteredVideos.length}
            delay={0.1}
            y={-10}
            transition={{
              type: "spring",
              stiffness: 90,
              damping: 18,
              mass: 0.8,
            }}
          >
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 pb-6">
              {filteredVideos.length > 0 ? (
                filteredVideos.map((video) => (
                  <Card
                    key={video._id}
                    className="shadow-lg rounded-2xl min-w-[320px] max-w-[350px] flex-shrink-0 snap-center hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-out bg-white"
                  >
                    <CardContent className="p-0">
                      {activeTab === "video" ? (
                        <div className="aspect-video w-full overflow-hidden rounded-t-2xl">
                          <video
                            src={video.video_url}
                            poster={video.imageUrl}
                            controls
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video w-full overflow-hidden rounded-t-2xl">
                          <iframe
                            src={video.youtubeUrl.replace(
                              "watch?v=",
                              "embed/"
                            )}
                            title={video.title}
                            className="w-full h-full"
                            frameBorder="0"
                            allowFullScreen
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                          {video.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(video.addedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex justify-center items-center w-full py-20">
                  <p className="text-gray-500 text-lg">No {activeTab === "video" ? "videos" : "YouTube videos"} available</p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </main>
    </div>
  );
}
