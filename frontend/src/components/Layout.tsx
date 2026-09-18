import { Outlet, Link, useLocation } from 'react-router-dom';

export function Layout() {
  const location = useLocation();
  const isInsights = location.pathname === '/insights';

  return (
    <div className="dark bg-background font-body-md text-body-md text-on-surface antialiased h-screen w-full overflow-hidden flex flex-col">
      <header className="shrink-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <div className="h-16 w-full px-margin flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md shrink-0">
            <Link to="/" className="flex items-center gap-space-sm cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[20px]">neurology</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">Lumina AI</span>
            </Link>
            <span className="font-label-sm text-label-sm text-primary bg-surface-container-high px-space-xs py-0.5 rounded border border-primary/20 hidden sm:inline">Discovery Engine V2.4</span>
            <div className="h-4 w-px bg-outline-variant/40 hidden xl:block"></div>
            <div className="hidden xl:flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container border border-outline-variant/50">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Model:</span>
              <span className="font-label-sm text-label-sm text-primary font-medium">OmniVision-Embed-70B</span>
            </div>
            <div className="hidden 2xl:flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container border border-outline-variant/50">
              <span className="material-symbols-outlined text-secondary text-[14px]">database</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Active Corpus:</span>
              <span className="font-label-sm text-label-sm text-secondary font-medium">33,680 queries analyzed</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-space-xs">
            <Link to="/" className={`px-space-sm py-1.5 font-body-md text-body-md transition-colors rounded-lg ${!isInsights ? 'bg-primary-container text-on-primary-container font-medium' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}>Query & Search</Link>
            <Link to="/insights" className={`px-space-sm py-1.5 font-body-md text-body-md transition-colors rounded-lg ${isInsights ? 'bg-primary-container text-on-primary-container font-medium' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}>Insights & Analytics</Link>
            <a className="px-space-sm py-1.5 font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors rounded-lg" href="#">Raw Evidence</a>
            <a className="px-space-sm py-1.5 font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors rounded-lg" href="#">PRD Specs</a>
          </nav>
          <div className="flex items-center gap-space-sm shrink-0">
            <button className="hidden sm:flex items-center gap-space-xs px-space-md py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/50 rounded-lg transition-colors font-body-sm text-body-sm" type="button">
              <span className="material-symbols-outlined text-[16px] text-primary">file_download</span>
              <span>Export Report</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.35)]">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full bg-surface flex-grow flex flex-col overflow-hidden relative">
        <Outlet />
      </main>

      <footer className="shrink-0 w-full bg-surface-container-lowest border-t border-outline-variant/30 py-space-md mt-auto">
        <div className="w-full px-margin flex flex-col sm:flex-row items-center justify-between gap-space-sm text-on-surface-variant font-label-sm text-label-sm">
          <span>Lumina AI Forensic Visual Intelligence Platform • Discovery Engine V2.4</span>
          <span>Latency: 14ms • Embedding Dim: 8192 • Precision: FP16</span>
        </div>
      </footer>
    </div>
  );
}
