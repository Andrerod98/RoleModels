import React from "react";
import { DragHandleIcon } from "@chakra-ui/icons";
import { GridItem, IconButton } from "@chakra-ui/react";
import { View } from "../../../../shared-object/views/View";
export enum Position {
  Before = -1,
  After = 1,
}

export function ViewItemOverlay({ id, items, ...props }: any) {
  const item = items[props.activeIndex];
  return (
    <GridItem
      rowSpan={item.view.getColumns()}
      colSpan={item.view.getRows()}
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
        {...props.listeners}
        {...props.attributes}
        zIndex={2}
        icon={<DragHandleIcon />}
      />
      {(props.item.view as View).getRoot().generateWidget()}
    </GridItem>
  );
}
