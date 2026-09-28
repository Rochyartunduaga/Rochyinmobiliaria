import { Hero } from "@/components/Hero";
import { Oasis } from "@/components/Oasis";
import { Reviews } from "@/components/Reviews";
import { CTA } from "@/components/CTA";
import { BlogPreview } from "@/components/BlogPreview";
import { Contact } from "@/components/Contact";

// metadata.title / description se heredan del layout (generateMetadata)
export default function HomePage() {
  return (
    <>
      <Hero />
      <Oasis />
      <Reviews />
      <CTA />
      <BlogPreview />
      <Contact />
    </>
  );
}
