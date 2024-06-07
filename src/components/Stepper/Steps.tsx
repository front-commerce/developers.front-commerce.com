import React, { cloneElement } from "react";
import type { StepProps } from "./Step";

type StepElement = React.ReactElement<StepProps & { mdxType: "Step" }>;

export default function Steps(props: { children: StepElement[] }) {
  const children = Array.isArray(props.children)
    ? props.children
    : [props.children];

  return (
    <nav aria-label="Progress">
      <div role="list" className="list-none ml-0 pl-0">
        {children.map((child, index) => {
          if (child.props.mdxType !== "Step") {
            throw new Error(
              `Steps component only accepts Step components as children. Found ${child.props.mdxType} instead.`
            );
          }

          return React.isValidElement(child)
            ? cloneElement(child, {
                step: index + 1,
                isLastStep: index === props.children.length - 1,
              })
            : child;
        })}
      </div>
    </nav>
  );
}
