/* eslint-disable react/display-name */
import {
  DragHandleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import { Box, GridItem, IconButton } from "@chakra-ui/react";
import React, { forwardRef, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { View } from "../../../../shared-object/views/View";
import { Position } from "./ViewItemOverlay";

export interface ViewItemProps {
  id: string;
  view: View;
  listeners: any;
  attributes: any;
  style: any;
  insertPosition: number;
  onClickRight: () => void;
  onClickLeft: () => void;
  onClickTopLeft: () => void;
  onClickBottomRight: () => void;
  onClickTop: () => void;
  onClickBottom: () => void;
  onClose: () => void;
}
export const ViewItem = forwardRef((props: ViewItemProps, ref: any) => {
  const [isOver, setOver] = useState(false);
  return (
    <GridItem
      rowSpan={1}
      colSpan={1}
      onMouseOver={() => setOver(true)}
      onMouseLeave={() => setOver(false)}
      bg={"papayawhip"}
      ref={ref}
      {...props}
      position={"relative"}
    >
      {/*
        <Popover>
          <PopoverTrigger>
            <IconButton
              size={"xs"}
              position={"absolute"}
              left={"0"}
              top={"0"}
              aria-label={"Search database"}
              isRound={true}
              zIndex={2}
              icon={<CgQr />}
            />
          </PopoverTrigger>
          <Portal>
            <PopoverContent w={"160px"}>
              <PopoverArrow />
              <PopoverBody>
                <Center>
                  <QRCode value={""} />
                </Center>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
        */}
      {!isOver ? (
        <></>
      ) : (
        <>
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
          <IconButton
            fontSize={"12px"}
            size={"xs"}
            aria-label={"Search database"}
            bg={"transparent"}
            _hover={{
              background: "rgba(255,0,0,0.25)",
            }}
            position={"absolute"}
            right={"1"}
            top={"1"}
            onClick={props.onClose}
            zIndex={2}
            icon={<IoTrashOutline />}
          />
          <IconButton
            size={"xs"}
            fontSize={"12px"}
            position={"absolute"}
            right={"0"}
            margin={"auto"}
            bottom={"0"}
            bg={"transparent"}
            _hover={{
              background: "blackAlpha.100",
            }}
            top={"0"}
            aria-label={"Search database"}
            isRound={false}
            onClick={props.onClickRight}
            zIndex={2}
            icon={<ChevronRightIcon />}
          />
          <IconButton
            size={"xs"}
            fontSize={"12px"}
            position={"absolute"}
            left={"0"}
            margin={"auto"}
            top={"0"}
            bg={"transparent"}
            _hover={{
              background: "blackAlpha.100",
            }}
            aria-label={"Search database"}
            isRound={false}
            onClick={props.onClickTopLeft}
            zIndex={2}
            icon={<ChevronLeftIcon transform={"rotate(45deg)"} />}
          />
          <IconButton
            size={"xs"}
            fontSize={"12px"}
            position={"absolute"}
            right={"0"}
            margin={"auto"}
            bottom={"0"}
            bg={"transparent"}
            _hover={{
              background: "blackAlpha.100",
            }}
            aria-label={"Search database"}
            isRound={false}
            onClick={props.onClickBottomRight}
            zIndex={2}
            icon={<ChevronRightIcon transform={"rotate(45deg)"} />}
          />
          <IconButton
            size={"xs"}
            fontSize={"12px"}
            position={"absolute"}
            left={"0"}
            bottom={"0"}
            bg={"transparent"}
            _hover={{
              background: "blackAlpha.100",
            }}
            top={"0"}
            margin={"auto"}
            aria-label={"Search database"}
            onClick={props.onClickLeft}
            zIndex={2}
            icon={<ChevronLeftIcon />}
          />
          <IconButton
            size={"xs"}
            fontSize={"12px"}
            position={"absolute"}
            right={"0"}
            left={"0"}
            bg={"transparent"}
            _hover={{
              background: "blackAlpha.100",
            }}
            top={"0"}
            margin={"auto"}
            aria-label={"Search database"}
            onClick={props.onClickTop}
            zIndex={2}
            icon={<ChevronUpIcon />}
          />
          <IconButton
            size={"xs"}
            fontSize={"12px"}
            position={"absolute"}
            right={"0"}
            left={"0"}
            bottom={"0"}
            bg={"transparent"}
            _hover={{
              background: "blackAlpha.100",
            }}
            margin={"auto"}
            zIndex={2}
            onClick={props.onClickBottom}
            aria-label={"Search database"}
            icon={<ChevronDownIcon />}
          />
        </>
      )}
      {props.view.getRoot().generateWidget()}
      {props.insertPosition === Position.Before ? (
        <Box
          h={"100%"}
          bg={"#4c9ffe"}
          w={"2px"}
          position={"absolute"}
          left={"-5px"}
        ></Box>
      ) : props.insertPosition === Position.After ? (
        <Box
          h={"100%"}
          bg={"#4c9ffe"}
          w={"2px"}
          right={"-5px"}
          position={"absolute"}
        ></Box>
      ) : (
        <></>
      )}
    </GridItem>
  );
});
