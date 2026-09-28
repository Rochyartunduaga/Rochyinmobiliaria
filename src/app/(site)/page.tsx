import { Hero } from "@/components/Hero";
import { Oasis } from "@/components/Oasis";
import { Reviews } from "@/components/Reviews";
import { CTA } from "@/components/CTA";
import { BlogPreview } from "@/components/BlogPreview";
import { Contact } from "@/components/Contact";

// metadata.title / description se heredan del layout (generateMetadata)
// Las noticias del inicio se refrescan al publicar desde /admin y, como respaldo, cada 5 minutos
export const revalidate = 300;

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
