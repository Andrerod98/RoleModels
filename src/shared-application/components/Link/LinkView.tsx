import { LinkUI } from "./LinkModel";
import React from "react";
import { LinkController } from ".";

export function LinkView({ controller }: { controller: LinkController }) {
  const component = controller.get() as LinkUI;
  return (
    <a
      key={component.id}
      href={component.href}
      style={component.style}
      onClick={() => {
        return false;
      }}
    >
      {component.value}
    </a>
  );
}
