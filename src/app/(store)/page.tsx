import { Hero } from "@/components/home/hero";
import { WorldsScroll } from "@/components/home/worlds-scroll";
import { Featured } from "@/components/home/featured";
import { EditionsExplainer, FinalCta, HowToBuy, InstagramFeed, LookTeaser, QuizCta } from "@/components/home/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WorldsScroll />
      <Featured />
      <QuizCta />
      <LookTeaser />
      <EditionsExplainer />
      <InstagramFeed />
      <HowToBuy />
      <FinalCta />
    </>
  );
}
