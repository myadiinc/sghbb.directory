export default function Footer() {
  return (
    <footer className="w-full">
      {/* About & Support section */}
      <div className="w-full bg-secondary/40 border-t border-border px-4 py-10">
        <div className="max-w-2xl mx-auto space-y-8">

          {/* About */}
          <div className="text-center">
            <h3 className="font-quicksand font-bold text-primary text-base mb-3">
              About This Directory
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This directory is a simple community space created by a Muslim HBB mama with Muslim HBB mamas in mind,
              and open to all local Muslim home‑based businesses.<br />
              All listings are submitted by the business owners themselves.<br />
              Browse, support, and share the love 💖
            </p>
          </div>

          {/* Support */}
          <div className="text-center">
            <h3 className="font-quicksand font-bold text-primary text-base mb-3">
              Support the Directory
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              This directory is free &amp; community‑driven.<br />
              No amount is too small,<br />
              for your support helps keep this directory running. 🫰🏼
            </p>

            {/* Support Methods — STACKED */}
            <div className="flex flex-col items-center justify-center gap-8">

              {/* PayNow */}
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  PayNow
                </p>
                <a
                  href="https://i.ibb.co/s9wzmDN2/Pay-Now-Support-SGHBBDirectory-V1-0.jpg"
                  target="_blank"
                  rel="noopener noreferrer">
                  
                  <img
                    src="https://i.ibb.co/s9wzmDN2/Pay-Now-Support-SGHBBDirectory-V1-0.jpg"
                    alt="PayNow QR Code"
                    className="w-36 h-36 object-contain rounded-lg border border-border shadow-sm" />
                  
                </a>
              </div>

              {/* Ko‑Fi */}
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Ko‑Fi
                </p>
                <a
                  href="https://ko-fi.com/O4O41XWXNX"
                  target="_blank"
                  rel="noopener noreferrer">
                  
                  <img
                    src="https://storage.ko-fi.com/cdn/kofi3.png?v=3"
                    alt="Buy Me a Coffee at ko-fi.com"
                    className="h-10 object-contain" />
                  
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Footer Links, Social & Copyright */}
      <div className="w-full bg-white border-t border-border px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Links to Blog, Help, Info */}
          <div className="flex justify-center gap-6 text-sm">
            <a href="/blog" className="text-primary hover:underline font-medium">Blog</a>
            <a href="/help" className="text-primary hover:underline font-medium">Help & Info</a>
            <a href="/info" className="text-primary hover:underline font-medium">About</a>
          </div>

          {/* Social icons */}
          <div className="flex justify-center items-center gap-4">
            <a href="https://facebook.com/sghbb.directory" target="_blank" rel="noopener noreferrer">
              <img src="https://i.ibb.co/C5BrJy4S/Facebook-SMIcon.png" alt="Facebook" className="w-8 h-8 object-contain hover:opacity-80 transition-opacity" />
            </a>
            <a href="https://instagram.com/sghbb.directory" target="_blank" rel="noopener noreferrer">
              <img src="https://i.ibb.co/TMRR0vvT/Instagram-SMIcon.png" alt="Instagram" className="w-8 h-8 object-contain hover:opacity-80 transition-opacity" />
            </a>
            <a href="https://threads.net/@sghbb.directory" target="_blank" rel="noopener noreferrer">
              <img src="https://i.ibb.co/tpq3bS3c/Threads-SMIcon.png" alt="Threads" className="w-8 h-8 object-contain hover:opacity-80 transition-opacity" />
            </a>
            <a href="https://www.tiktok.com/@sghbb.directory" target="_blank" rel="noopener noreferrer">
              <img src="https://i.ibb.co/zWxrzFfw/Tik-Tok-SMIcon.png" alt="TikTok" className="w-8 h-8 object-contain hover:opacity-80 transition-opacity" />
            </a>
          </div>

          {/* Hit counter */}
          <div className="flex justify-center">
            <a href="https://www.hitwebcounter.com/convert-pdf-to-jpg" target="_blank" rel="noopener noreferrer">
              <img
                src="https://hitwebcounter.com/counter/counter.php?page=21490454&style=0006&nbdigits=7&type=page&initCount=234"
                title="Easy to JPG Conversion"
                alt="Easy to JPG Conversion"
                style={{ border: 0 }} />
              
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">© 2026 SGHBB.Directory • Find &amp; Be Found</p>
          </div>

        </div>
      </div>
    </footer>);

}