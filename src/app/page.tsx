import { Hero } from "@/components/sections/Hero";
import { Positioning } from "@/components/sections/Positioning";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { TemplateHelix } from "@/components/sections/TemplateHelix";
import { TemplateCatalog } from "@/components/sections/TemplateCatalog";
import { Capabilities } from "@/components/sections/Capabilities";
import { Process } from "@/components/sections/Process";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Positioning />
      <FeaturedWork />
      <TemplateHelix />
      <TemplateCatalog />
      <Capabilities />
      <Process />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </>
  );
}
