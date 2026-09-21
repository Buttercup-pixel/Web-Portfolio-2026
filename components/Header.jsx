"use client";

export default function Header({ onAboutClick }) {
  return (
    <header className="fixed top-3 md:top-6 left-0 right-0 z-50 flex flex-wrap items-center gap-3 md:gap-8 px-4 md:px-8 text-[13px] md:text-base tracking-[0.08em]">
      <span className="text-accent text-lg md:text-xl whitespace-nowrap">
        johanna nordlander
      </span>

      <nav className="flex gap-4 md:gap-6 text-muted">
        <span>makeup artist</span>
        <span>art director</span>
      </nav>

      <button
        type="button"
        onClick={onAboutClick}
        className="text-accent mr-auto cursor-pointer hover:opacity-70 transition-opacity"
      >
        about
      </button>

      <a
        href="mailto:johannanordlandermua@gmail.com"
        className="text-ink hover:text-accent transition-colors whitespace-nowrap"
      >
        johannanordlandermua@gmail.com
      </a>
    </header>
  );
}
