/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-namespace */
import { Box, Flex, IconButton } from "@chakra-ui/react";
import styled from "@emotion/styled";
import _ from "lodash";
import React from "react";
import { Resizable, ResizeCallbackData, ResizeHandle } from "react-resizable";
import { ViewNodeModel } from "./ViewNodeModel";
import { useDraggable } from "@dnd-kit/core";
import { UnlockIcon } from "@chakra-ui/icons";
import { DiagramEngine } from "@projectstorm/react-diagrams";
namespace S {
  export const Node = styled.div<{ background: string; selected: boolean }>`
    background-color: ${(p) => p.background};
    border-radius: 5px;
    font-family: sans-serif;
    color: white;
    border: solid 2px black;
    overflow: visible;
    font-size: 11px;
    border: solid 2px ${(p) => (p.selected ? "rgb(0,192,255)" : "black")};
  `;

  export const Title = styled.div`
    background-color: #4d9ee0;
    display: flex;
    white-space: nowrap;
    justify-items: center;
  `;

  export const TitleName = styled.div`
    flex-grow: 1;
    padding: 5px 5px;
  `;

  export const PortsContainer = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    &:first-of-type {
      margin-right: 10px;
    }

    &:only-child {
      margin-right: 0px;
    }
  `;
}

interface ViewComponentProps {
  node: ViewNodeModel;
  engine: DiagramEngine;
  onResize: (
    e: React.SyntheticEvent<Element, Event>,
    data: ResizeCallbackData
  ) => any;
  onResizeStop: (
    e: React.SyntheticEvent<Element, Event>,
    data: ResizeCallbackData
  ) => any;
  handle: (resizeHandle: ResizeHandle, ref: any) => React.ReactNode;
  generatePort: (port: any) => JSX.Element;
  isPreview: boolean;
}
export const ViewComponent: React.FC<ViewComponentProps> = (
  props: ViewComponentProps
) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: props.node.getID(),
    data: {
      name: props.node.getOptions().name,
    },
  });

  return (
    <Box ref={setNodeRef} {...listeners} {...attributes}>
      {props.node.isSelected() && !props.isPreview ? (
        <Resizable
          className={"resize-box"}
          height={props.node.height}
          width={props.node.width}
          handle={(h: any, ref: any) => props.handle(h, ref)}
          onResize={props.onResize}
          onResizeStop={props.onResizeStop}
          resizeHandles={["sw", "se", "nw", "ne", "w", "e", "n", "s"]}
        >
          <Box
            opacity={1}
            borderWidth={"2px"}
            borderColor={"black"}
            bg={"white"}
            width={props.node.width + "px"}
            height={props.node.height + "px"}
          >

            {props.node.hasRole() ? (
              <IconButton
                aria-label={"Search database"}
                onClick={() => {
                  props.node.getRole().removeItem(props.node);
                  props.node.setRole(null);
                  props.node.iterateListeners((listener) => {
                    if (listener.positionChanged) {
                      props.node.getListenerHandle(listener).deregister();
                    }
                    // props.node.deregisterListener(listener);
                    // props.node.deregisterListener(props.node.);
                  });

                  props.node.setPosition(0, 0);
                  props.engine.repaintCanvas();
                }}
                icon={<UnlockIcon />}
              />
            ) : (
              <></>
            )}
            <Flex
              backgroundImage={
                "linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2))"
              }
            >
              <S.PortsContainer>
                {_.map(props.node.getInPorts(), props.generatePort)}
              </S.PortsContainer>
              <S.PortsContainer>
                {_.map(props.node.getOutPorts(), props.generatePort)}
              </S.PortsContainer>
            </Flex>
            {/* }  <PortWidget
      style={{
        top: this.props.node.height / 2 - 8,
        right: -5,
        position: "absolute",
      }}
      port={
        this.props.node.getPort("Teste") as PortModel<PortModelGenerics>
      }
      engine={this.props.engine}
    >
      <S.Port />
    </PortWidget> */}
          </Box>
        </Resizable>
      ) : (
        <Box
          opacity={1}
          borderWidth={"2px"}
          borderColor={"black"}
          bg={"white"}
          width={props.isPreview ? "100px" : props.node.width + "px"}
          height={props.isPreview ? "100px" : props.node.height + "px"}
          overflow={"hidden"}
        >
        </Box>
      )}
    </Box>
  );
};
