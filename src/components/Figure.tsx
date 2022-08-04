import React from "react";
import type { RequireExactlyOne } from "type-fest";

export type FigureProps = {
  /** The image URL  */
  src: string;
  /** The image Component */
  children: React.ReactNode;
  /** Defines an alternative text description of the image. */
  alt?: string;
  /** Represents a caption or legend describing the rest of the contents of its parent */
  caption?: string;
};

export default function Figure({
  src,
  children = null,
  alt,
  caption,
}: RequireExactlyOne<FigureProps, "src" | "children">) {
  return (
    <figure className="text-center py-6">
      {src && <img src={src} alt={alt} />}
      {children}
      {caption && <figcaption className="text-xs">{caption}</figcaption>}
    </figure>
  );
}
