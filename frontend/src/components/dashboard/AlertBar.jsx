import React, { useState } from "react";
import { X } from "lucide-react";

const AlertBar = ({ message, avatar, onClose }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <div className="flex items-center gap-3 p-3 mb-5 rounded-lg bg-[#ecfdf3] dark:bg-green-950/30 border border-green-200 dark:border-green-900">
      {avatar ? (
        <img src={avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-[#3d5ee1] text-white flex items-center justify-center text-xs font-bold shrink-0">
          S
        </div>
      )}
      <p className="flex-1 text-sm text-green-800 dark:text-green-300">{message}</p>
      <button
        onClick={handleClose}
        className="p-1 rounded text-green-600 hover:bg-green-100 dark:hover:bg-green-900/50"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AlertBar;
