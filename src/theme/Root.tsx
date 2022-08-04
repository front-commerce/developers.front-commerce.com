import React, { useEffect } from "react";
import { Intercom } from "@site/src/components/Intercom";

export default function Root({ children }) {
  useEffect(() => {
    if ("cookieconsent" in window) {
      (window as any)?.cookieconsent?.initialise?.({
        palette: {
          popup: {
            background: "rgb(85 85 85 / 85%)",
          },
          button: {
            text: "#ffff",
            background: "#ff2a6a",
          },
        },
      });
    }
  }, []);

  return <Intercom>{children}</Intercom>;
}
