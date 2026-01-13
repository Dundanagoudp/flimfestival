"use client";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getEvent, getEventDetails, getFullEvent } from "@/services/eventsService";
import { EventItem, GetFullEventResponse } from "@/types/eventsTypes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoaderSpinner";
import Reveal from "@/components/common/Reveal";
import { useRouter } from "next/navigation";
import { getMediaUrl } from "@/utils/media";

type TimeSlot = {
  _id: string;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  type: string;
};

export default function ViewEvent() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] =
    useState<GetFullEventResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [registering, setRegistering] = useState<string | null>(null);
  const getImageUrl = (image: string) => {
    return getMediaUrl(image);
  };
  // Fetch all events for badges
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvent();
        console.log("response of events", response);
        setEvents(response || []);
        // set initial active id only if none exists, using functional updater
        if (response.length > 0) {
          setActiveEventId((prev) => prev ?? response[0]._id);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      }
    };
    fetchEvents();
  }, []);

  // Fetch full event details when active event changes
  // useEffect(() => {
  //   const fetchFullEvent = async () => {
  //     if (!activeEventId) return;

  //     setLoading(true);
  //     try {
  //       const response = await getFullEvent(activeEventId);
  //       console.log("response of full event", response);
  //       setSelectedEvent(response);
  //     } catch (error) {
  //       console.error("Error fetching full event:", error);
  //       setSelectedEvent(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchFullEvent();
  // }, [activeEventId]);


  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!activeEventId) return;
      try {
        const response = await getEventDetails(activeEventId);
        console.log("response of event details", response);
        if (response) {
          setSelectedEvent(response as unknown as GetFullEventResponse);
          }
          
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };
    if (activeEventId) void fetchEventDetails();
  }, [activeEventId]);  
  const getMonthName = (month: number) =>
    ["January","February","March","April","May","June","July","August","September","October","November","December"][month - 1] || "";

  const handleEventSelect = (eventId: string) => {
    if (!eventId) return;
    console.log("eventId", eventId);
    setSelectedEvent(null);
    setActiveEventId(eventId);
  };

  const handleRegister = () => {
    setRegistering(activeEventId);
    // Redirect to registration page
    router.push("/workshop");
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white">
      <main className="w-full">
        <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center sm:text-left">
              Events in <span className="text-primary">Arunachal Pradesh</span>
            </h1>
          </div>

          {/* Event Selection Badges */}
          <div className="mt-6 lg:mt-10 gap-2 sm:gap-4 flex flex-wrap justify-center sm:justify-start">
            {events.map((event) => (
              <Reveal
                key={event._id}
                delay={0.1}
                y={-10}
                transition={{
                  type: "spring",
                  stiffness: 90,
                  damping: 18,
                  mass: 0.8,
                }}
              >
                <Badge
                  className={`w-auto h-[32px] sm:h-[28px] px-3 sm:px-4 cursor-pointer transition-all duration-200 text-sm ${
                    activeEventId === event._id
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => handleEventSelect(event._id)}
                  aria-pressed={activeEventId === event._id}
                >
                  {event.name}
                </Badge>
              </Reveal>
            ))}
          </div>

          {/* Event Details */}
          {loading && (
            <div className="mt-8 text-center">
              <p>Loading event details...</p>
            </div>
          )}

          {!loading && events.length === 0 && (
            <div className="mt-6 lg:mt-8 text-center p-6 lg:p-8 bg-gray-50 rounded-lg mx-2 sm:mx-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                No Events Available
              </h3>
              <p className="text-sm sm:text-base text-gray-500">
                Please check back later for upcoming events.
              </p>
            </div>
          )}

          {selectedEvent && !loading && (
            <div className="mt-6 lg:mt-8">
              {/* Event Header with Registration */}
              <div className="mb-6 lg:mb-8 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4 sm:p-6 border border-primary/20">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 lg:gap-6">
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3">
                      {selectedEvent.event.name}
                    </h2>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base lg:text-lg leading-relaxed">
                      {selectedEvent.event.description}
                    </p>

                    {/* Event Details with Icons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mt-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                        <span className="font-medium text-sm sm:text-base">
                          {selectedEvent.event.year} - {" "}
                          {getMonthName(selectedEvent.event.month)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                        <span className="font-medium text-sm sm:text-base">
                          {selectedEvent.event.totalDays} Days
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                        <span className="font-medium text-sm sm:text-base">
                          Multiple Sessions
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Registration Button */}
                  <div className="flex flex-col items-center lg:items-end">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleRegister}
                        disabled={registering === selectedEvent.event._id}
                        className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      >
                        {registering === selectedEvent.event._id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="hidden sm:inline">
                              Registering...
                            </span>
                            <span className="sm:hidden">...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">
                              Register Now
                            </span>
                            <span className="sm:hidden">Register</span>
                          </div>
                        )}
                      </Button>
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary animate-pulse hover:animate-bounce cursor-pointer">
                        <ArrowRight className="h-3 w-3 text-white" />
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Free Registration
                    </p>
                  </div>
                </div>
              </div>

              {/* Days and Time Slots - Mobile Optimized Layout */}
              <div className="space-y-4 lg:space-y-6">
                {selectedEvent.days.map((day) => (
                  <div
                    key={day._id}
                    className="border rounded-lg p-4 sm:p-6 bg-gray-50"
                  >
                    {/* Mobile: Stacked Layout, Desktop: Grid Layout */}
                    <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-6 space-y-4 lg:space-y-0">
                      {/* Day Info */}
                      <div className="lg:col-span-4">
                        <div className="space-y-3 lg:space-y-4">
                          <div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                              {day.name}
                            </h3>
                            <p className="text-gray-600 text-sm sm:text-base">
                              {day.description.slice(0, 80)}...
                            </p>
                          </div>
                          {day.image && (
                            <div className="w-full">
                              <img
                                src={getImageUrl(day.image)}
                                alt={day.name}
                                className="w-full aspect-[4/3] object-contain rounded-md shadow-sm bg-gray-100"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Day's Time Slots */}
                      <div className="lg:col-span-8">
                        <div className="bg-white rounded-lg p-3 sm:p-4 h-full">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 border-b pb-2 gap-2">
                            <h4 className="text-base sm:text-lg font-medium text-primary">
                              Schedule for {day.name}
                            </h4>
                            <Badge
                              variant="secondary"
                              className="text-xs w-fit"
                            >
                              {(day as any).timeSlots?.length || 0} Sessions
                            </Badge>
                          </div>
                          <ScrollArea className="h-[250px] sm:h-[300px] lg:h-[350px] pr-2 sm:pr-4">
                            <div className="space-y-3">
                              {(day as any).timeSlots?.length > 0 ? (
                                (day as any).timeSlots.map((slot: TimeSlot) => (
                                  <div
                                    key={slot._id}
                                    className="bg-gradient-to-r from-gray-50 to-white p-3 sm:p-4 rounded-lg border border-gray-200 hover:shadow-md hover:border-primary/30 transition-all duration-200"
                                  >
                                    {/* Mobile: Stacked, Desktop: Side by side */}
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                                      <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                          <h5 className="font-semibold text-gray-800 text-sm sm:text-base">
                                            {slot.title}
                                          </h5>
                                          <Badge
                                            variant="outline"
                                            className="text-xs bg-primary/10 text-primary border-primary/20 w-fit"
                                          >
                                            {slot.type}
                                          </Badge>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed">
                                          {slot.description}
                                        </p>
                                        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                          <span className="truncate">
                                            {slot.location}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="text-left sm:text-right">
                                        <div className="bg-primary/10 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-primary/20 w-fit sm:w-auto">
                                          <div className="flex items-center gap-1 text-primary mb-1">
                                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span className="text-xs font-medium">
                                              Time
                                            </span>
                                          </div>
                                          <p className="font-bold text-primary text-xs sm:text-sm whitespace-nowrap">
                                            {slot.startTime} - {slot.endTime}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-8 sm:py-12 text-gray-500">
                                  <Calendar className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-300" />
                                  <p className="text-base sm:text-lg font-medium">
                                    No sessions scheduled
                                  </p>
                                  <p className="text-xs sm:text-sm">
                                    Check back later for updates
                                  </p>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
