interface DayTabsProps {
  days: number[];
  activeDay: number;
  onDayChange: (day: number) => void;
}

const DayTabs = ({ days, activeDay, onDayChange }: DayTabsProps) => {
  return (
    <div className="inline-flex items-center rounded-full bg-primary p-1.5 shadow-lg">
      {days.map((day) => (
        <button
          key={day}
          onClick={() => onDayChange(day)}
          className={`
            relative px-8 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300
            ${activeDay === day
              ? "bg-card text-accent shadow-md scale-105"
              : "text-primary-foreground hover:text-accent-foreground/80"
            }
          `}
        >
          DAY {day}
        </button>
      ))}
    </div>
  );
};

export default DayTabs;
