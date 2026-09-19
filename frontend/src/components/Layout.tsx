import { Outlet, Link } from 'react-router-dom';

export function Layout() {

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
          </div>
          <div className="flex items-center gap-space-sm shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.35)]">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full bg-surface flex-grow flex flex-col overflow-hidden relative">
        <Outlet />
      </main>


    </div>
  );
}
