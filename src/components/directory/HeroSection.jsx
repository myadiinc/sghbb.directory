import { useState } from "react";
import { Link } from "react-router-dom";

export default function HeroSection({ totalCount }) {
  return (
    <div
      className="relative w-full py-16 px-4 flex flex-col items-center justify-center text-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, hsl(20,35%,16%) 0%, hsl(25,40%,22%) 50%, hsl(20,30%,14%) 100%)" }}
    >
      {/* Background texture overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1400&q=60')", backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-2">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3" style={{ background: "hsl(38,75%,45%)" }}>
            <span className="text-3xl">🏠</span>
          </div>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-white tracking-wide">
            HBB.Directory
          </h1>
          <p className="text-sm font-inter font-light tracking-widest" style={{ color: "hsl(38,75%,65%)" }}>
            Find &amp; Be Found
          </p>
        </div>

        <p className="text-white/80 font-inter text-sm md:text-base max-w-md leading-relaxed">
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
            className="px-8 py-3 rounded-full font-inter font-semibold text-sm transition-all hover:opacity-90 hover:scale-105 shadow-lg"
            style={{ background: "hsl(38,75%,45%)", color: "#fff" }}
          >
            SUBMIT YOUR HBB LISTING HERE
          </Link>
          <p className="text-white/40 text-xs max-w-xs text-center">
            Note: This form works only on Chrome or Safari. A Google account is required.
          </p>
        </div>
      </div>
    </div>
  );
}