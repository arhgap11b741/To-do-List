import React from "react";

interface DoneIconProps {
  className?: string;
}

export default function DoneIcon({ className }: DoneIconProps) {
  return (
    <div
      className={`inline-flex items-center justify-center px-4 py-2 bg-green-700 text-yellow-300 rounded-full font-bold text-sm ${className}`}
    >
      DONE
    </div>
  );
}
