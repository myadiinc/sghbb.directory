export default function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-16 py-8 px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">🏠</span>
          <span className="font-playfair font-bold text-primary text-lg">HBB.Directory</span>
        </div>
        <p className="text-xs text-muted-foreground">Find &amp; Be Found • Singapore's Centralised HBB Directory</p>
        <div className="flex justify-center gap-4 mt-4">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">Instagram</a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">Facebook</a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">TikTok</a>
        </div>
        <p className="text-xs text-muted-foreground mt-4">© {new Date().getFullYear()} HBB.Directory. All rights reserved.</p>
      </div>
    </footer>
  );
}