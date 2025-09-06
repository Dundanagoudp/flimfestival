'use client'
import Reveal from '@/components/common/Reveal';
import { Card, CardContent } from '@/components/ui/card'
import { getVideoBlog } from '@/services/videosServices';
import { GetAllVideosResponse, VideoBlog } from '@/types/videosTypes';
import React, { useEffect, useState } from 'react'

export default function ShowVideo() {
    const [videoBlog, setVideoBlog] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<"video" | "youtube">("video");
    useEffect(() => {
        const fetchVideoBlog = async () => {
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


    if (loading) return <p className="p-6">Loading...</p>;
    return (
        <div>

            <main className="w-full px-4 bg-white">
                <div className="px-10 py-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="w-full px-4 bg-white">
                        {/* Tabs */}
                        <div className="flex border-b mb-6">
                            {(["video", "youtube"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2 text-sm font-medium -mb-px border-b-2 transition-colors duration-200 ${activeTab === tab
                                            ? "border-primary text-black"
                                            : "border-transparent text-gray-500 hover:text-black"
                                        }`}
                                >
                                    {tab === "video" ? "Videos" : "YouTube"}
                                </button>
                            ))}
                        </div>


                        {/* Cards */}
                        <div className="px-4 pb-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <Reveal key={filteredVideos.length} delay={0.1} y={-10} transition={{ type: 'spring', stiffness: 90, damping: 18, mass: 0.8 }}>
                            {filteredVideos.map((video) => (
                                <Card key={video._id} className="shadow-md rounded-2xl w-[300px] h-[300px] overflow-hidden hover:scale-102 transition-all duration-300">
                                    <CardContent className="p-0">
                                        {activeTab === "video" ? (
                                            <video
                                                src={video.video_url}
                                                poster={video.imageUrl}
                                                controls
                                                className="w-full h-48 object-cover"
                                            />
                                        ) : (
                                            <iframe
                                                src={video.youtubeUrl.replace("watch?v=", "embed/")}
                                                title={video.title}
                                                className="w-full h-48"
                                                frameBorder="0"
                                                allowFullScreen
                                            ></iframe>
                                        )}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg">{video.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {new Date(video.addedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            </Reveal>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
