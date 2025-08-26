import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

export function Button({ className, children, variant = "primary", to, ...props }) {
  const baseStyles =
    "px-5 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 focus:ring-indigo-400",
    secondary:
      "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 focus:ring-pink-400",
    outline:
      "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-300",
    danger:
      "bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 focus:ring-red-400",
  };

  // 🔹 If `to` is passed, render a Link instead of a button
  if (to) {
    return (
      <Link
        to={to}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {children}
      </Link>
    );
  }

  // 🔹 Otherwise, render a regular button
  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
