import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import Button from "../common/Button";

const InsightBanner = ({ title, message, actionLabel, onAction }) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#1e2a5e] via-[#2a3a7a] to-[#3d5ee1] text-white p-5 mb-5">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 right-16 w-20 h-20 border-2 border-white rounded-full" />
        <div className="absolute bottom-0 right-32 w-14 h-14 border-2 border-white rotate-45" />
      </div>
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-white/80 text-[11px] font-semibold border border-white/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Insight
          </div>
          <h3 className="text-base font-bold">{title}</h3>
          <p className="text-sm text-white/70 mt-1 max-w-2xl">{message}</p>
        </div>
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            variant="secondary"
            size="sm"
            icon={ArrowRight}
            className="shrink-0 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default InsightBanner;
