"use client";

import { withBasePath } from "@/lib/basePath";
import GalleryColumn from "./GalleryColumn";

const img = (name) => withBasePath(`/images/${name}`);

const leftTiles = [
  {
    src: img("img-01-floral.jpeg"),
    alt: "High fashion editorial portrait",
    ratio: "4 / 5",
    label: "make up",
  },
  {
    src: img("img-03-avantgarde.jpg"),
    alt: "Avant garde fashion pose",
    ratio: "7 / 8",
    label: "make up",
  },
  {
    src: img("img-05-blue.jpg"),
    alt: "Blue couture editorial portrait",
    ratio: "4 / 5",
    label: "make up",
  },
  {
    src: img("img-06-reddress.jpg"),
    alt: "Red dress fashion editorial",
    ratio: "2 / 3",
    label: "make up",
  },
  {
    src: img("img-08-gloves.jpg"),
    alt: "Black gloves luxury editorial",
    ratio: "4 / 5",
    label: "make up",
  },
];

const rightTiles = [
  {
    src: img("img-02-redskirt.jpg"),
    alt: "High fashion red skirt editorial",
    ratio: "4 / 5",
    label: "digital",
  },
  {
    src: img("logo-acte.svg"),
    alt: "Acté Atelier logo",
    ratio: "1 / 1",
    label: "digital",
    logo: true,
    logoBg: "#e4e4e4",
  },
  {
    src: img("img-04-redlit.webp"),
    alt: "Red-lit fashion editorial",
    ratio: "4 / 5",
    label: "digital",
  },
  {
    src: img("logo-mamika.svg"),
    alt: "Mamika Suzuki logo",
    ratio: "1 / 1",
    label: "digital",
    logo: true,
    logoBg: "#cfd2d6",
  },
  {
    src: img("img-07-whitedress.jpg"),
    alt: "White dress high fashion editorial",
    ratio: "3 / 4",
    label: "digital",
  },
  {
    src: img("img-10-dramatic.jpg"),
    alt: "Dramatic dark fashion portrait",
    ratio: "4 / 3",
    label: "digital",
  },
];

export default function Gallery() {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="flex justify-center gap-6 md:gap-12 max-w-[900px] mx-auto px-4 md:px-8 pt-[130px] md:pt-[160px] pb-40">
      <GalleryColumn tiles={leftTiles} speed={0.03} className="w-full md:w-[280px]" />
      <GalleryColumn
        tiles={rightTiles}
        speed={0.07}
        className="w-full md:w-[280px] mt-[-40px] md:mt-[-80px]"
      />

      <a
        href="#top"
        onClick={scrollToTop}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-[0.1em] text-ink hover:text-accent transition-colors"
      >
        go up
      </a>
    </main>
  );
}
