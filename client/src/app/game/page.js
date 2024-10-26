"use client";

import HeaderText from "@/components/HeaderText";
import Navbar from "@/components/Navbar";
import GameCarousel from "@/components/GameCarousel";
import MostPlayed from "@/components/MostPlayed";
import LetsPlaySection from "@/components/LetsPlaySection";

export default function Page() {

  return (
    <>
      <Navbar />
      <div className="pt-32 bg-sharp-black text-white px-14">
        <HeaderText
          header="Games"
          description="Hey champ! hit the bank and get your asserts to play a game."
        />
        <GameCarousel />
        <MostPlayed />
        <LetsPlaySection />
      </div>
    </>
  );
}
