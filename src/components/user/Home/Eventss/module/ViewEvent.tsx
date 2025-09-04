'use client'
import React, { useEffect, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { getEvent, getFullEvent } from '@/services/eventsService';
import { EventItem, EventDayItem, TimeEntry, GetFullEventResponse } from '@/types/eventsTypes';
import { ScrollArea } from '@/components/ui/scroll-area';


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
    const [events, setEvents] = useState<EventItem[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<GetFullEventResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeEventId, setActiveEventId] = useState<string | null>(null);

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

  return (
    <div>
      <main className="w-full px-4" style={{ backgroundColor: "#ffffff" }}>
        <div className="px-10 py-10 ">
          <div>
            <h1 className='text-3xl'>Events in <span className='text-primary'> Arunachal Pradesh</span></h1>
          </div>

          {/* Event Selection Badges */}
          <div className='mt-10 px-8 gap-4 flex flex-wrap'>
            {events.map((event) => (
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
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{selectedEvent.event.name}</h2>
                <p className="text-gray-600 mt-2">{selectedEvent.event.description}</p>
                <div className="flex gap-4 mt-3 text-sm text-gray-500">
                  <span>Year: {selectedEvent.event.year}</span>
                  <span>Month: {selectedEvent.event.month}</span>
                  <span>Total Days: {selectedEvent.event.totalDays}</span>
                </div>
              </div>

              {/* Days and Time Slots - Associated Layout */}
              <div className="space-y-6">
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
                        <h4 className="text-lg font-medium text-primary mb-4 border-b pb-2">
                          Schedule for {day.name}
                        </h4>
                        <ScrollArea className="h-[300px] pr-4">
                          <div className="space-y-3">
                            {(day as any).timeSlots?.length > 0 ? (
                              (day as any).timeSlots.map((slot: TimeSlot) => (
                                <div key={slot._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <h5 className="font-semibold text-gray-800 mb-1">{slot.title}</h5>
                                      <p className="text-sm text-gray-600 mb-2">{slot.description}</p>
                                      <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                          📍 {slot.location}
                                        </span>
                                        <Badge variant="outline" className="text-xs">
                                          {slot.type}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="text-right ml-4">
                                      <div className="bg-primary/10 px-3 py-2 rounded-lg">
                                        <p className="font-semibold text-primary text-sm">
                                          {slot.startTime} - {slot.endTime}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8 text-gray-500">
                                <p>No time slots scheduled for this day</p>
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
