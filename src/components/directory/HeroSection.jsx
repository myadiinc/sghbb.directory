import { useState } from "react";
import { Link } from "react-router-dom";

export default function HeroSection({ totalCount }) {
  return (
    <div
      className="relative w-full py-10 px-4 flex flex-col items-center justify-center text-center overflow-hidden mb-16"
      style={{ minHeight: "220px" }}>
      
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('https://i.ibb.co/pB1GG7sf/SGHBBD-BG-V3-0.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }} />
      

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        {/* Logo */}
        <div className="flex flex-col items-center mb-1">
          <img
            src="https://i.ibb.co/mC8w4ghP/SGHBBD-Logo-V2-2b.png"
            alt="SGHBB Directory Logo"
            className="w-80 h-60 object-contain drop-shadow-lg" />
          
        </div>

        <p className="text-white/80 font-nunito text-sm md:text-xl max-w-md leading-relaxed font-semibold">Discover Muslim Home-Based Businesses on Singapore's Centralised HBB Directory

        </p>
      </div>
    </div>);

}