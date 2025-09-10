"use client";
import React from "react";
import { CircleLoader } from "react-spinners";

export function Spinner({ size = 48, color = "#1FC16B", ...props }) {
  return (
    <div className="flex items-center justify-center bg-[#fff8ed]">
      <CircleLoader size={size} color={color} {...props} />
    </div>
  );
} 