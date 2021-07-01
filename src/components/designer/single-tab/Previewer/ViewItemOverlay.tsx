import React from "react";
import { DragHandleIcon } from "@chakra-ui/icons";
import { GridItem, IconButton } from "@chakra-ui/react";
import { View } from "../../../../shared-object/views/View";
export enum Position {
  Before = -1,
  After = 1,
}

export function ViewItemOverlay({
  id,
  view,
  ...props
}: {
  id: string;
  view: View;
}) {
  return (
    <GridItem
      rowSpan={1}
      colSpan={1}
      bg={"papayawhip"}
      opacity={0.7}
      {...props}
      position={"relative"}
    >
      <IconButton
        fontSize={"10px"}
        size={"xs"}
        aria-label={"Search database"}
        position={"absolute"}
        right={"8"}
        bg={"transparent"}
        _hover={{
          background: "blackAlpha.100",
        }}
        top={"1"}
        zIndex={2}
        icon={<DragHandleIcon />}
      />
      {view.getRoot().generateWidget()}
    </GridItem>
  );
}
