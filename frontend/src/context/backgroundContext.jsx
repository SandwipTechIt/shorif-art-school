// BackgroundProvider.jsx
import React from "react";

export default function BackgroundProvider({ children }) {
  return (
    <>
      {/* Fixed background layer */}
      <div className="fixed inset-0 w-full min-h-screen overflow-hidden">
        {/* Base background */}
        <div className="absolute inset-0 w-full h-full dark:bg-black bg-transparent -z-30" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 w-full h-full -z-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, #2E583B12 1px, transparent 1px), linear-gradient(to bottom, #2E583B12 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            opacity: 0.33034979652277985,
          }}
        />

        {/* Radial dots */}
        <div
          className="absolute inset-0 w-full h-full -z-20"
          style={{
            backgroundImage: "radial-gradient(#F42895 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            opacity: 0.42261593039219997,
          }}
        />

        {/* Coloured light spot */}
        <div
          className="absolute -z-10 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: "43.92916367572632%",
            top: "46.17915472023162%",
            width: "450px",
            height: "450px",
            backgroundColor: "#30D8D6",
            opacity: 0.4291829929517383,
            filter: "blur(84px)",
          }}
        />
      </div>

      {/* Everything you wrap with this provider will sit on top */}
      <main className="relative z-10">{children}</main>
    </>
  );
}
