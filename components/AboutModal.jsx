"use client";

import { useEffect } from "react";
import { withBasePath } from "@/lib/basePath";
import DrawCanvas from "./DrawCanvas";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="white" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="white" stroke="none" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zM8.5 8h3.8v2.05h.05c.53-1 1.83-2.05 3.77-2.05C20.5 8 21.5 10.4 21.5 13.6V23h-4v-8.5c0-2-.03-4.6-2.8-4.6-2.8 0-3.2 2.2-3.2 4.45V23h-4V8z" />
  </svg>
);

export default function AboutModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 flex items-start justify-center overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-bg w-full max-w-3xl my-6 md:my-10 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="close"
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-accent transition-colors cursor-pointer"
        >
          ×
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={withBasePath("/images/img-01-floral.jpeg")}
          alt="Johanna Nordlander — placeholder photo, to be replaced"
          className="w-full h-auto max-h-[70vh] object-cover grayscale"
        />

        <div className="p-5 md:p-8">
          <h2 className="text-accent text-2xl mb-4">about johanna</h2>
          <p className="text-ink text-sm md:text-base leading-relaxed mb-6 normal-case tracking-normal">
            Johanna Nordlander is a Stockholm-based makeup artist working
            across fashion, image-making, and visual stories. This page is a
            quiet placeholder for a longer introduction, selected
            collaborations, and contact details.
          </p>

          <div className="flex gap-3 mb-5">
            <a
              href="#"
              aria-label="Instagram"
              className="w-9 h-9 flex items-center justify-center bg-accent rounded-md hover:opacity-80 transition-opacity"
            >
              <InstagramIcon />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="w-9 h-9 flex items-center justify-center bg-accent rounded-md hover:opacity-80 transition-opacity"
            >
              <LinkedInIcon />
            </a>
          </div>

          <div className="text-sm md:text-base space-y-1.5 mb-8">
            <p>
              e-mail -{" "}
              <a href="mailto:johannanordlandermua@gmail.com" className="hover:text-accent">
                johannanordlandermua@gmail.com
              </a>
            </p>
            <p>
              makeup enquiries -{" "}
              <a href="mailto:alex@linkdetails.com" className="hover:text-accent">
                alex@linkdetails.com
              </a>
            </p>
            <p>
              <a href="#" className="hover:text-accent">
                makeup portfolio
              </a>
            </p>
          </div>

          <h3 className="text-accent text-lg mb-2">leave a trace</h3>
          <p className="text-accent/80 text-xs md:text-sm mb-4 normal-case tracking-normal">
            draw something with your mouse or finger — saved drawings stay in
            this session only.
          </p>
          <DrawCanvas />
        </div>
      </div>
    </div>
  );
}
