import type { VenueSchedule } from "@/data/scheduleData";
import EventCard from "./EventCard";

interface VenueColumnProps {
  venue: VenueSchedule;
  colorClass: string;
}

const VenueColumn = ({ venue, colorClass }: VenueColumnProps) => {
  return (
    <div className="flex flex-col">
      <div className={`rounded-t-lg ${colorClass} px-4 py-3 text-center`}>
        <h3 className="font-display text-base font-bold uppercase tracking-wide text-inherit">
          {venue.venue}
        </h3>
        {venue.venueSubtitle && (
          <p className="text-xs mt-0.5 opacity-90 text-inherit">({venue.venueSubtitle})</p>
        )}
      </div>
      <div className="flex-1 space-y-3 rounded-b-lg border border-t-0 border-border bg-card/50 p-3">
        {venue.events.map((event, i) => (
          <EventCard key={i} event={event} />
        ))}
      </div>
    </div>
  );
};

export default VenueColumn;
