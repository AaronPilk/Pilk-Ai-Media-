import { Hero } from "@/components/sections/Hero";
import { PositioningAssembler } from "@/components/sections/PositioningAssembler";
import { BuiltSiteShowcase } from "@/components/sections/BuiltSiteShowcase";
import { TemplateCatalog } from "@/components/sections/TemplateCatalog";
import { Capabilities } from "@/components/sections/Capabilities";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PositioningAssembler />
      <BuiltSiteShowcase />
      <TemplateCatalog />
      <Capabilities />
      <ProcessTimeline />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </>
  );
}
