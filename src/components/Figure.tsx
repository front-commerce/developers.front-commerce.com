export type FigureProps = {
  children: React.ReactNode;
  /** Represents a caption or legend describing the rest of the contents of its parent */
  caption?: string;
};

export default function Figure({ children, caption }) {
  return (
    <figure className="text-center py-6">
      {children}
      {caption && <figcaption className="text-xs">{caption}</figcaption>}
    </figure>
  );
}
