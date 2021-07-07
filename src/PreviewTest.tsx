import { Box, Button, Flex, layout } from "@chakra-ui/react";
import React, { useState } from "react";
import { useEffect } from "react";
import { uuid } from "uuidv4";
import { LayoutModal } from "./components/LayoutModal";
import { ILayoutNode } from "./shared-application/roles/ILayout";
import { LayoutNode } from "./shared-application/roles/Layout";

export function AppTest(props: { layout: LayoutNode }) {
  const [selectedNode, setSelectedNode] = useState("view");
  const [layout, setLayout] = useState(props.layout.toLayout());

  useEffect(() => {
    props.layout.getRoot().setMaxListeners(1);
    props.layout.on("change", (layout) => {
      console.log("changing");
      setLayout(props.layout.toLayout());
    });
  });

  console.log(selectedNode);
  return (
    <Box height={"100vh"} width={"100vw"}>
      <PreviewTest
        height={"100%"}
        width={"100%"}
        selectedNode={selectedNode}
        layout={props.layout}
        isOpenLayoutModal={true}
        setSelected={(newViewId: string) => {
          setSelectedNode(newViewId);
          console.log("Removing");
          console.log(newViewId);
        }}
      />
      <LayoutModal
        layout={props.layout}
        selectedNode={selectedNode}
        isOpen={true}
        onOpen={() => {}}
        onClose={() => {}}
        setSelected={(newViewId: string) => {
          setSelectedNode(newViewId);
        }}
        newViewId={uuid()}
      />
    </Box>
  );
}

export function PreviewTest(props: {
  layout: LayoutNode;
  height: string;
  width: string;
  isOpenLayoutModal: boolean;
  setSelected: (newViewId: string) => void;
  selectedNode: string;
}) {
  const generateWidget = (node: ILayoutNode): JSX.Element => {
    console.log("GENERATING WIDGET");
    console.log(node);
    switch (node.name) {
      case "div":
        return (
          <Flex
            flex={1}
            width={"100%"}
            height={"100%"}
            direction={"column"}
            bg={"blue.200"}
            overflow={"hidden"}
          >
            {node.children.map((child) => {
              return generateWidget(child);
            })}
          </Flex>
        );
      case "flex":
        return (
          <Flex
            flex={1}
            width={"100%"}
            height={"100%"}
            overflow={"hidden"}
            bg={"orange"}
            direction={"row"}
          >
            {node.children.map((child) => {
              return generateWidget(child);
            })}
          </Flex>
        );
      case "view":
        return (
          <Box
            key={"_box_" + node.viewId}
            flex={1}
            width={"100%"}
            height={"100%"}
            position={"relative"}
            overflow={"hidden"}
            bg={props.selectedNode === node.viewId ? "black" : "green"}
            onClick={() => {
              if (props.isOpenLayoutModal) {
                props.setSelected(node.viewId);
              }
            }}
          >
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                props.layout.removeChild(node.id);
                props.setSelected("");
              }}
            >
              Remove
            </Button>
          </Box>
        );
      default:
        return <></>;
    }
  };
  console.log("Rendering");
  console.log(props.layout);
  return (
    <Box h={props.height} w={props.width} overflow={"hidden"}>
      {props.layout ? generateWidget(props.layout.toLayout()) : ""}
    </Box>
  );
}
