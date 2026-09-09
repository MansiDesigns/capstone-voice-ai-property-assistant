import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scout - Accessible AI Property Discovery",
  description: "Accessible AI Property Discovery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background font-body-md text-body-md text-on-surface antialiased min-h-screen">
        <a className="sr-only focus:not-sr-only focus:fixed focus:top-space-xs focus:left-space-xs focus:z-50 focus:px-space-md focus:py-space-xs focus:bg-secondary focus:text-on-secondary focus:font-body-bold focus:text-body-bold focus:rounded focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary" href="#main-content">Skip to main content</a>
        
        <header className="fixed top-0 left-0 right-0 h-20 bg-surface-container-lowest z-40 border-b border-outline-variant" role="banner">
          <div className="h-20 w-full px-margin-desktop flex items-center justify-between gap-space-md">
            <div className="flex-1 max-w-xl mx-auto">
              <form className="relative flex items-center" role="search">
                <label className="sr-only" htmlFor="global-voice-search">Search properties by text or voice command</label>
                <div className="relative w-full flex items-center">
                  <span aria-hidden="true" className="material-symbols-outlined absolute left-3 text-on-surface-variant pointer-events-none">search</span>
                  <input className="w-full h-12 pl-10 pr-12 rounded-xl bg-surface-container-low border border-outline-variant text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary focus:bg-surface-container-lowest transition-colors" id="global-voice-search" placeholder="Search city, ZIP, or say 'Find accessible 2-beds'" type="search" />
                  <button aria-label="Activate voice assistant: Scouting properties via voice" className="absolute right-1 w-10 h-10 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-secondary hover:bg-surface-container focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary" type="button">
                    <span aria-hidden="true" className="material-symbols-outlined">mic</span>
                  </button>
                </div>
              </form>
            </div>
            <div className="flex items-center gap-space-sm shrink-0">
              <div className="flex items-center gap-space-xs">
                <button aria-label="User account and settings" className="min-h-target-min min-w-target-min p-space-2xs rounded-full focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary flex items-center gap-2" type="button">
                  <img alt="Profile" className="w-8 h-8 rounded-full object-cover border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9YraE_3Qfad1Hy4qy3NWNda57GI9mocf7vLz6nWKfZqiCzaOSRsHhuvyz6k9Lt_gkn70WcpmK5aW5cf9sx_5phGiWTWmFGtDAWqaBnKdStlEcdXLi0MjvRQw-qNi6XmTiDO8cLmvkaVix1Qwvzq15QOtOFCMtpDrkfF4Rr-i6Qdne5MjytLmqr25pht2V4XX0OOoh9sZ7c6AjpxMRhhd4b1Bt1_WIoncItrZj8DeTDgb1DXPRzL38Mg" />
                  <span className="hidden md:inline font-body-bold text-body-bold text-on-surface">Patel E.</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <aside className="fixed left-0 top-20 bottom-0 w-72 bg-surface-container-lowest border-r border-outline-variant z-30 flex flex-col justify-between p-space-md hidden md:flex">
          <div className="flex flex-col gap-space-sm">
            <p className="px-space-sm font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Navigation</p>
            <nav aria-label="Main Navigation" className="flex flex-col gap-space-xs">
              <a aria-current="page" className="min-h-target-min flex items-center justify-between px-space-md py-space-xs rounded-xl focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary transition-colors bg-primary-container text-on-secondary-container font-body-bold" href="#">
                <div className="flex items-center gap-space-sm">
                  <span aria-hidden="true" className="material-symbols-outlined text-[22px]">real_estate_agent</span>
                  <span className="font-body-md text-body-md">Discover Homes</span>
                </div>
                <span className="sr-only">Current page</span>
              </a>
              <a className="min-h-target-min flex items-center justify-between px-space-md py-space-xs rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary transition-colors" href="#">
                <div className="flex items-center gap-space-sm">
                  <span aria-hidden="true" className="material-symbols-outlined text-[22px]">favorite</span>
                  <span className="font-body-md text-body-md">Shortlist &amp; Saved</span>
                </div>
                <span aria-label="3 items saved" className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">3</span>
              </a>
              <a className="min-h-target-min flex items-center justify-between px-space-md py-space-xs rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary transition-colors" href="#">
                <div className="flex items-center gap-space-sm">
                  <span aria-hidden="true" className="material-symbols-outlined text-[22px]">calendar_month</span>
                  <span className="font-body-md text-body-md">Booked Visits</span>
                </div>
                <span aria-label="1 upcoming visit" className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm">1</span>
              </a>
              <a className="min-h-target-min flex items-center justify-between px-space-md py-space-xs rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary transition-colors" href="#">
                <div className="flex items-center gap-space-sm">
                  <span aria-hidden="true" className="material-symbols-outlined text-[22px]">explore</span>
                  <span className="font-body-md text-body-md">Neighborhood Explorer</span>
                </div>
              </a>
              <a className="min-h-target-min flex items-center justify-between px-space-md py-space-xs rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary transition-colors" href="#">
                <div className="flex items-center gap-space-sm">
                  <span aria-hidden="true" className="material-symbols-outlined text-[22px]">accessibility_new</span>
                  <span className="font-body-md text-body-md">Accessibility Preferences</span>
                </div>
              </a>
            </nav>
          </div>
          <div className="p-space-sm rounded-xl bg-surface-container-low border border-outline-variant">
            <div className="flex items-center gap-space-xs mb-space-2xs">
              <span aria-hidden="true" className="material-symbols-outlined text-secondary text-[20px]">support_agent</span>
              <span className="font-body-bold text-body-bold text-on-surface">Voice Guidance</span>
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Say "Help Scout" or press Alt + V to toggle voice mode anytime.</p>
          </div>
        </aside>

        <div className="md:pl-72">
          {children}
        </div>
      </body>
    </html>
  );
}
