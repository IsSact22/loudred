import React from "react";

export default function StartButton({
  text,
  isLoading = false,
  className = "",
  disabled,
  ...props
}) {
  const baseClasses =
    "w-full bg-red-rusty shadow-lg text-white rounded-full font-bold transition duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed";
  const loadingClasses = isLoading
    ? "flex justify-center items-center gap-2"
    : "";

  return (
    <button
      className={`${baseClasses} ${loadingClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <div className="w-4 h-4 relative bg-gradient-to-r from-blue-950 via-blue-500 via-30% to-blue-200 to-90% rounded-full animate-spin">
          <div className="absolute left-1/2 top-1/2 bg-red-rusty rounded-full transform -translate-x-1/2 -translate-y-1/2 w-3 h-3"></div>
        </div>
      )}
      {text}
    </button>
  );
}
