export interface ScheduleEvent {
  time: string;
  title: string;
  director?: string;
  moderator?: string;
  duration?: string;
  description?: string;
  panelists?: string[];
}

export interface VenueSchedule {
  venue: string;
  venueSubtitle?: string;
  events: ScheduleEvent[];
}

import type { SessionPlan } from "@/types/sessionPlanTypes";

export interface DaySchedule {
  day: number;
  date: string;
  venues: VenueSchedule[];
}

export function sessionPlanToDaySchedules(plan: SessionPlan | null): DaySchedule[] {
  if (!plan?.days?.length) return [];
  const sorted = [...plan.days].sort((a, b) => a.dayNumber - b.dayNumber);
  return sorted.map((d) => ({
    day: d.dayNumber,
    date: d.date ?? "",
    venues: (d.screens ?? []).map((screen, screenIndex) => ({
      venue: screen.screenName ?? "",
      venueSubtitle: screenIndex >= 0 ? `Screen ${screenIndex + 1}` : undefined,
      events: (screen.slots ?? []).map((slot) => ({
        time: slot.startTime ?? "",
        title: slot.title ?? "",
        director: slot.director,
        moderator: slot.moderator,
        duration: slot.duration,
        description: slot.description,
        panelists: undefined,
      })),
    })),
  }));
}

export const scheduleData: DaySchedule[] = [
  {
    day: 1,
    date: "8th February, 2029",
    venues: [
      {
        venue: "Amphitheatre",
        events: [
          { time: "10:30 AM", title: "Talk with Meenakshi Shedde", moderator: "Dominic M. Sangma" },
          { time: "11:45 AM", title: "Workshop on Colour Grading", director: "Prithvi Bhuddavorapu (Colorist)", description: "Bridge Post Works" },
          { time: "02:00 PM", title: "Panel Discussion on 'Promotion & Marketing of Regional Films'", moderator: "Sanju Dodum", panelists: ["Dominic Sangma (Film Maker)", "Tai Gungte (Actor)", "Jack Toniya Budh VP, (Protocol FFA)", "Mingkeng Osik, (President FTGA)"] },
        ],
      },
      {
        venue: "Auditorium",
        venueSubtitle: "Screen 1",
        events: [
          { time: "10:10 AM", title: "Last Days of Summer", director: "Stenzin Tankyong", duration: "15 minutes" },
          { time: "10:35 AM", title: "Nine Hills One Valley", director: "Haobam Paban Kumar", duration: "1h 15m" },
          { time: "12:15 PM", title: "Nocturnal Burger", director: "Reema Sen", duration: "28 minutes" },
          { time: "02:45 PM", title: "Rapture", director: "Dominic M. Sangma", duration: "2h 7m" },
        ],
      },
      {
        venue: "Mobile Digital Movie Theatre",
        venueSubtitle: "Screen 2",
        events: [
          { time: "10:30 AM", title: "Mera Dharam Meri Maa", director: "Lt. Bhupen Hazarika", duration: "1h 50m" },
          { time: "01:00 PM", title: "Aamis", director: "Bhaskar Hazarika", duration: "1h 48m" },
          { time: "03:30 PM", title: "Local Short Films", description: "Collection of regional short films" },
        ],
      },
    ],
  },
  {
    day: 2,
    date: "9th February, 2029",
    venues: [
      {
        venue: "Amphitheatre",
        events: [
          { time: "10:00 AM", title: "Masterclass on Documentary Filmmaking", director: "Anand Patwardhan" },
          { time: "01:00 PM", title: "Workshop on Sound Design", director: "Resul Pookutty" },
        ],
      },
      {
        venue: "Auditorium",
        venueSubtitle: "Screen 1",
        events: [
          { time: "10:00 AM", title: "The Unexpected Guest", director: "Rima Das", duration: "1h 45m" },
          { time: "12:30 PM", title: "Echoes of the Valley", director: "Pradip Kurbah", duration: "2h 10m" },
          { time: "03:00 PM", title: "Silent River", director: "Wanphrang Diengdoh", duration: "1h 30m" },
        ],
      },
      {
        venue: "Mobile Digital Movie Theatre",
        venueSubtitle: "Screen 2",
        events: [
          { time: "10:30 AM", title: "Mountain Songs", director: "Aimee Baruah", duration: "1h 20m" },
          { time: "01:00 PM", title: "Northeast Shorts Showcase", description: "5 short films from emerging filmmakers" },
        ],
      },
    ],
  },
  {
    day: 3,
    date: "10th February, 2029",
    venues: [
      {
        venue: "Amphitheatre",
        events: [
          { time: "10:00 AM", title: "Panel: Future of Independent Cinema", moderator: "Jahnu Barua", panelists: ["Rima Das", "Dominic Sangma", "Aimee Baruah"] },
          { time: "02:00 PM", title: "Closing Ceremony & Awards", description: "Award presentation and closing remarks" },
        ],
      },
      {
        venue: "Auditorium",
        venueSubtitle: "Screen 1",
        events: [
          { time: "10:00 AM", title: "Memories of a Forgotten Land", director: "Bobby Sharma", duration: "2h 5m" },
          { time: "01:00 PM", title: "Festival Highlights Reel", duration: "45 minutes" },
        ],
      },
      {
        venue: "Mobile Digital Movie Theatre",
        venueSubtitle: "Screen 2",
        events: [
          { time: "10:00 AM", title: "Student Film Competition", description: "Screening of top 8 student films" },
          { time: "02:00 PM", title: "Audience Choice Screening", description: "Re-screening of the most popular film" },
        ],
      },
    ],
  },
];
