import React from "react";

const ClassRoutine = ({ items = [] }) => {
  const defaultItems = [
    { subject: "Maths", teacher: "Aaron", room: "12-A", time: "09:30 - 10:30", color: "bg-blue-500" },
    { subject: "English", teacher: "Hellana", room: "12-B", time: "10:30 - 11:30", color: "bg-yellow-500" },
    { subject: "Physics", teacher: "Morgan", room: "12-C", time: "11:30 - 12:30", color: "bg-green-500" },
  ];

  const list = items.length ? items : defaultItems;

  return (
    <div className="card-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-[#202c4b] dark:text-white">
          Class Routine
        </h3>
        <button className="text-xs font-medium text-[#3d5ee1] hover:underline">
          View All
        </button>
      </div>
      <div className="space-y-3">
        {list.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50"
          >
            <div className={`w-1 h-10 rounded-full ${item.color} shrink-0`} />
            <div className="w-9 h-9 rounded-full bg-[#3d5ee1]/10 text-[#3d5ee1] flex items-center justify-center text-xs font-bold shrink-0">
              {item.teacher?.charAt(0) || "T"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#202c4b] dark:text-white">
                {item.subject}
              </p>
              <p className="text-xs text-neutral-400">
                {item.teacher} · Room {item.room}
              </p>
            </div>
            <span className="text-xs text-neutral-500 shrink-0">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassRoutine;
