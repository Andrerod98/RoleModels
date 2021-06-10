/* eslint-disable @typescript-eslint/no-namespace */
import * as React from "react";
import { Center, Box, Text } from "@chakra-ui/react";

export interface CatalogBarItemProps {
  model: any;
  name: string;
  children: JSX.Element;
}

export const CatalogBarItem = (props: CatalogBarItemProps) => {
  return (
    <Box
      align={"center"}
      justify={"center"}
      draggable={true}
      onDragStart={(event) => {
        event.dataTransfer.setData(
          "storm-diagram-node",
          JSON.stringify(props.model)
        );
      }}
    >
      <Center>{props.children}</Center>
      <Text>{props.name}</Text>
    </Box>
  );
};
