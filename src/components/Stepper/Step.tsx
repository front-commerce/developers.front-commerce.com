import React, { type PropsWithChildren } from "react";

export type StepProps = PropsWithChildren<{
  step: number;
  isLastStep?: boolean;
}>;

export default function Step(props: StepProps) {
  return (
    <li key={props.step} className="relative">
      {props.isLastStep ? null : (
        <div
          className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-zinc-100 dark:bg-zinc-800"
          aria-hidden="true"
        ></div>
      )}

      <div className="group relative flex items-start">
        <span className="flex h-9 items-center" aria-hidden="true">
          <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-solid border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 ">
            <span className="h-8 w-8 rounded-full flex place-content-center items-center font-medium text-zinc-400">
              {props.step}
            </span>
          </span>
        </span>
        <div className="ml-4 flex min-w-0 flex-col mt-1">{props.children}</div>
      </div>
    </li>
  );
}
