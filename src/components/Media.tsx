import Image from "next/image";

type MediaProps = {
  src?: string;
  alt: string;
  /** Descripción que se muestra mientras no exista la imagen real */
  pending: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Posición del texto del placeholder ("top" para no chocar con textos superpuestos) */
  labelAt?: "center" | "top";
};

/**
 * Imagen optimizada con next/image. Si aún no hay archivo (src vacío),
 * muestra un placeholder visible con [CONTENIDO PENDIENTE].
 * El contenedor padre debe tener `relative` y un alto/aspect-ratio definido.
 */
export function Media({ src, alt, pending, className = "", sizes = "100vw", priority, labelAt = "center" }: MediaProps) {
  if (src) {
    return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />;
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={`absolute inset-0 flex justify-center ${labelAt === "top" ? "items-start pt-24" : "items-center"} bg-gradient-to-br from-sand-deep via-sand to-[#d9e6ea] p-4 text-center ${className}`}
    >
      <span className="max-w-xs text-xs font-bold tracking-wide text-ink-soft uppercase">
        [CONTENIDO PENDIENTE: {pending}]
      </span>
    </div>
  );
}
