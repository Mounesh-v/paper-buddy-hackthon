import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Button from "../common/Button";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const ScheduleCalendar = ({ events = [] }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const monthName = new Date(currentYear, currentMonth).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="card-panel p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-[#202c4b] dark:text-white">
          Schedules
        </h3>
        <Button size="sm" icon={Plus}>
          Add New
        </Button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-[#202c4b] dark:text-white">
          {monthName}
        </span>
        <button
          onClick={nextMonth}
          className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-neutral-400 mb-1">
        {DAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {cells.map((day, i) => {
          const isToday =
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();
          return (
            <div
              key={i}
              className={`py-1.5 rounded-lg text-xs ${
                !day
                  ? ""
                  : isToday
                    ? "bg-[#3d5ee1] text-white font-bold"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
              }`}
            >
              {day || ""}
            </div>
          );
        })}
      </div>

      {events.length > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2 flex-1">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
            Upcoming Events
          </p>
          {events.map((event, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <div className="w-8 h-8 rounded-lg bg-[#eef1fd] text-[#3d5ee1] flex items-center justify-center text-xs font-bold shrink-0">
                {event.day}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#202c4b] dark:text-white truncate">
                  {event.title}
                </p>
                <p className="text-xs text-neutral-400">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduleCalendar;
