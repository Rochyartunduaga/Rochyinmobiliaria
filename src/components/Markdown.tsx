import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renderiza el contenido de las noticias. No permite HTML crudo (seguro para contenido editable). */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-oasis">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
