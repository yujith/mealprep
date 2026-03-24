import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-[#f5f3ef] pb-20 md:pb-0">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="text-xl font-bold tracking-tighter text-[#534434]">SauPreps</div>
            <p className="mt-3 text-sm leading-relaxed text-[#534434]/80">
              Bringing the heart of Sri Lankan home-cooking to your modern lifestyle. Fresh, authentic, and made with love.
            </p>
            <p className="mt-4 text-sm font-medium text-primary">
              Made with love by Saumya in Sri Lanka
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div className="flex flex-col gap-3">
              <span className="font-bold text-primary">Explore</span>
              <Link href="/menu" className="text-sm text-[#534434]/80 transition-colors hover:text-primary">Menu</Link>
              <Link href="/orders" className="text-sm text-[#534434]/80 transition-colors hover:text-primary">My Orders</Link>
              <Link href="/cart" className="text-sm text-[#534434]/80 transition-colors hover:text-primary">Cart</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-bold text-primary">Connect</span>
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="text-sm text-[#534434]/80 transition-colors hover:text-primary">WhatsApp</a>
              <a href="#" className="text-sm text-[#534434]/80 transition-colors hover:text-primary">Instagram</a>
              <a href="#" className="text-sm text-[#534434]/80 transition-colors hover:text-primary">Facebook</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-bold text-primary">Legal</span>
              <a href="#" className="text-sm text-[#534434]/80 transition-colors hover:text-primary">Privacy Policy</a>
              <a href="#" className="text-sm text-[#534434]/80 transition-colors hover:text-primary">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#d8c3ad]/30 pt-6 text-center text-xs text-[#534434]/50">
          &copy; {new Date().getFullYear()} SauPreps. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
