import { LinkUI } from "./LinkModel";
import React from "react";
import { LinkController } from ".";
import { Link } from "@chakra-ui/react";

export function LinkView({ controller }: { controller: LinkController }) {
  const component = controller.get() as LinkUI;
  return (
    <Link
      key={"link-" + component.id}
      href={component.href}
      style={component.style}
      onClick={() => {
        controller.emitEvent("onClick");
      }}
    >
      {component.value}
    </Link>
  );
}
