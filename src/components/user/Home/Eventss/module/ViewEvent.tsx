'use client'
import React, { useEffect, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getEvent, getFullEvent } from '@/services/eventsService';
import { EventItem, EventDayItem, TimeEntry, GetFullEventResponse } from '@/types/eventsTypes';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoaderSpinner';
import HeroEvent from './HeroEvent';
import Reveal from '@/components/common/Reveal';
import { useRouter } from 'next/navigation';


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
    const [selectedEvent, setSelectedEvent] = useState<GetFullEventResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeEventId, setActiveEventId] = useState<string | null>(null);
    const [registering, setRegistering] = useState<string | null>(null);

    // Fetch all events for badges
    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const response = await getEvent();
          setEvents(response);
          // Auto-select first event if available
          if (response.length > 0 && !activeEventId) {
            setActiveEventId(response[0]._id);
          }
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      }
      fetchEvents();
    }, []);

    // Fetch full event details when active event changes
    useEffect(() => {
      const fetchFullEvent = async () => {
        if (!activeEventId) return;

        setLoading(true);
        try {
          const response = await getFullEvent(activeEventId);
          console.log("event",response);
          setSelectedEvent(response);
        } catch (error) {
          console.error('Error fetching full event:', error);
          setSelectedEvent(null);
        } finally {
          setLoading(false);
        }
      };

      fetchFullEvent();
    }, [activeEventId]);

    const handleEventSelect = (eventId: string) => {
      setActiveEventId(eventId);
    };

    const handleRegister = (eventId: string, eventName: string) => {
      // Redirect to registration page
      router.push('/events/register');
    };
    if (loading) {
      return (
        <div className="flex items-center justify-center p-6">
          <LoadingSpinner />
        </div>
      );
    }
  return (
    <div>
    
      <main className="w-full px-4" style={{ backgroundColor: "#ffffff" }}>
        <div className="px-10 py-10 ">
          <div>
            <h1 className='text-3xl'>Events in <span className='text-primary'> Arunachal Pradesh</span></h1>
          </div>

          {/* Event Selection Badges */}
          <div className='mt-10 px-8 gap-4 flex flex-wrap'>
            {events.map((event,index) => (
              <Reveal key={index} delay={0.1} y={-10} transition={{ type: 'spring', stiffness: 90, damping: 18, mass: 0.8 }}>
              <Badge
                key={event._id}
                className={`w-auto h-[28px] px-3 cursor-pointer transition-all duration-200 ${
                  activeEventId === event._id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => handleEventSelect(event._id)}
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

          {selectedEvent && !loading && (
            <div className="mt-8">
              {/* Event Header with Registration */}
              <div className="mb-8 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">{selectedEvent.event.name}</h2>
                    <p className="text-gray-600 mb-4 text-lg leading-relaxed">{selectedEvent.event.description}</p>
                    
                    {/* Event Details with Icons */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="font-medium">{selectedEvent.event.year} - Month {selectedEvent.event.month}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="font-medium">{selectedEvent.event.totalDays} Days</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-5 h-5 text-primary" />
                        <span className="font-medium">Multiple Sessions</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Registration Button */}
                  <div className="ml-6">
                    <Button
                      onClick={() => handleRegister(selectedEvent.event._id, selectedEvent.event.name)}
                      disabled={registering === selectedEvent.event._id}
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                      {registering === selectedEvent.event._id ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Registering...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Register Now
                        </div>
                      )}
                    </Button>
                    <p className="text-xs text-gray-500 mt-2 text-center">Free Registration</p>
                  </div>
                </div>
              </div>

              {/* Days and Time Slots - Associated Layout */}
              <div className="space-y-6 ">
                {selectedEvent.days.map((day) => (
                  <div key={day._id} className="grid grid-cols-12 gap-6 border rounded-lg p-6 bg-gray-50">
                    {/* Left Side - Day Info */}
                    <div className="col-span-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">{day.name}</h3>
                          <p className="text-gray-600 text-sm">{day.description}</p>
                        </div>
                        {day.image && (
                          <div className="w-full">
                            <img
                              src={day.image}
                              alt={day.name}
                              className="w-full aspect-[4/3] object-contain rounded-md shadow-sm bg-gray-100"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Side - Day's Time Slots */}
                    <div className="col-span-8">
                      <div className="bg-white rounded-lg p-4 h-full">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                          <h4 className="text-lg font-medium text-primary">
                            Schedule for {day.name}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            {(day as any).timeSlots?.length || 0} Sessions
                          </Badge>
                        </div>
                        <ScrollArea className="h-[300px] pr-4">
                          <div className="space-y-3">
                            {(day as any).timeSlots?.length > 0 ? (
                              (day as any).timeSlots.map((slot: TimeSlot) => (
                                <div key={slot._id} className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-200 hover:shadow-md hover:border-primary/30 transition-all duration-200">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <h5 className="font-semibold text-gray-800">{slot.title}</h5>
                                        <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                                          {slot.type}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">{slot.description}</p>
                                      <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <MapPin className="w-4 h-4" />
                                        <span>{slot.location}</span>
                                      </div>
                                    </div>
                                    <div className="text-right ml-4">
                                      <div className="bg-primary/10 px-4 py-3 rounded-lg border border-primary/20">
                                        <div className="flex items-center gap-1 text-primary mb-1">
                                          <Clock className="w-4 h-4" />
                                          <span className="text-xs font-medium">Time</span>
                                        </div>
                                        <p className="font-bold text-primary text-sm">
                                          {slot.startTime} - {slot.endTime}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-12 text-gray-500">
                                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p className="text-lg font-medium">No sessions scheduled</p>
                                <p className="text-sm">Check back later for updates</p>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
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
  )
}
