/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-namespace */
import * as React from "react";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import { RoleNodeModel } from "./RoleNodeModel";

import "react-resizable/css/styles.css";
import "../../../styles/example.css";
//import "react-edit-text/dist/index.css";

import {
  Box,
  Flex,
  Center,
  Editable,
  EditablePreview,
  EditableInput,
} from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";

export interface RoleNodeWidgetProps {
  node: RoleNodeModel;
  engine: DiagramEngine;
}

export const RoleNodeWidget = (props: RoleNodeWidgetProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: props.node.getID(),
  });
  return (
    <Box>
      <Box
        w={"500px"}
        h={"500px"}
        opacity={0.3}
        bg={isOver ? "#FFC356" : "white"}
        ref={setNodeRef}
      ></Box>
      <Flex height={"20px"}>
        <Box flex={"1"}>
          <Center>
            <Editable defaultValue={props.node.getOptions().name}>
              <EditablePreview />
              <EditableInput />
            </Editable>
          </Center>
        </Box>
      </Flex>
    </Box>
  );
};
