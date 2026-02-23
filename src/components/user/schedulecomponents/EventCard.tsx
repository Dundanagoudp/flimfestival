import type { ScheduleEvent } from "@/data/scheduleData";
import { Clock, User, Users } from "lucide-react";

interface EventCardProps {
  event: ScheduleEvent;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <div className="group rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:shadow-md hover:border-primary/40 animate-fade-in">
      <div className="flex items-start gap-3">
        <span className="shrink-0 rounded-md bg-primary/15 px-3 py-1 text-xs font-bold text-accent">
          {event.time}
        </span>
      </div>
      <h4 className="mt-2 font-display text-base font-bold leading-snug text-foreground">
        {event.title}
      </h4>
      {event.director && (
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          Director: {event.director}
        </p>
      )}
      {event.moderator && (
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          Moderator: {event.moderator}
        </p>
      )}
      {event.duration && (
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {event.duration}
        </p>
      )}
      {event.panelists && (
        <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
          {event.panelists.map((p, i) => (
            <li key={i} className="pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-accent">
              {p}
            </li>
          ))}
        </ul>
      )}
      {event.description && (
        <p className="mt-1.5 text-xs text-muted-foreground italic">{event.description}</p>
      )}
    </div>
  );
};

export default EventCard;
