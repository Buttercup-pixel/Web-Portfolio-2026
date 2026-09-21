"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Gallery from "@/components/Gallery";
import AboutModal from "@/components/AboutModal";

export default function Home() {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <Header onAboutClick={() => setAboutOpen(true)} />
      <Gallery />
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}
