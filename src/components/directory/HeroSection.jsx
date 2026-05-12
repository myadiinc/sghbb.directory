import { useState } from "react";
import { Link } from "react-router-dom";

export default function HeroSection({ totalCount }) {
  return (
    <div
      className="relative w-full py-16 px-4 flex flex-col items-center justify-center text-center overflow-hidden"
      style={{ minHeight: "320px" }}>
      
      {/* Background image */}
      <div className="absolute inset-0"
        style={{ backgroundImage: "url('https://i.ibb.co/pB1GG7sf/SGHBBD-BG-V3-0.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-2">
          <img src="https://i.ibb.co/mC8w4ghP/SGHBBD-Logo-V2-2b.png" alt="SGHBB Directory Logo" className="w-24 h-24 object-contain mb-3 drop-shadow-lg" />
        </div>

        <p className="text-white/80 font-nunito text-sm md:text-base max-w-md leading-relaxed">
          Discover Muslim Home-Based Businesses on<br />
          Singapore's Centralised HBB Directory
        </p>

        {/* Submit CTA */}
        <div className="flex flex-col items-center gap-2 mt-4">
          <p className="text-white/60 text-xs">
            Come join the <span className="font-bold text-white">{totalCount || 0}</span> HBBs listed ✨
          </p>
          <Link
            to="/submit"
            className="px-8 py-3 rounded-full font-nunito font-semibold text-sm transition-all hover:opacity-90 hover:scale-105 shadow-lg"
            style={{ background: "hsl(38,75%,45%)", color: "#fff" }}>
            
            SUBMIT YOUR HBB LISTING HERE
          </Link>
          <p className="text-white/40 text-xs max-w-xs text-center">
            Note: This form works only on Chrome or Safari. A Google account is required.
          </p>
        </div>
      </div>
    </div>);

}