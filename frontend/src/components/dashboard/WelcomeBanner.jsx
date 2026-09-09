import React from "react";
import { RefreshCw } from "lucide-react";

const WelcomeBanner = ({ name, subtitle = "Have a good day at work" }) => {
  const today = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#1e2a5e] via-[#2a3a7a] to-[#3d5ee1] text-white p-6 mb-5">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-20 w-24 h-24 border-2 border-white rounded-full" />
        <div className="absolute bottom-2 right-40 w-16 h-16 border-2 border-white rotate-45" />
        <div className="absolute top-8 right-60 w-12 h-12 border-2 border-white rounded-lg" />
      </div>
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Welcome Back, {name}</h2>
          <p className="text-sm text-white/70 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/60 bg-white/10 px-3 py-2 rounded-lg">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Updated Recently on {today}</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
