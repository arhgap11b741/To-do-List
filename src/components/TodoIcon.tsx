import React from "react";

interface TodoIconProps {
  className?: string;
}

export default function TodoIcon({ className }: TodoIconProps) {
  return (
    <div
      className={`inline-flex items-center justify-center px-4 py-2 bg-lime-300 text-green-700 rounded-full font-bold text-sm ${className}`}
    >
      TO DO
    </div>
  );
}
