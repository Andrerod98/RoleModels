import React, { useState } from "react";
import { BrushChart2Model } from ".";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import { BrushChart2Controller } from "./BrushChart2Controller";
import { AiOutlineHighlight } from "react-icons/ai";
import {
  BsBrush,
  BsPencil,
  BsPen,
  BsEraser,
  BsTextareaT,
  BsBoundingBox,
  BsCircle,
  BsTrash,
  BsZoomIn,
  BsZoomOut,
} from "react-icons/bs";
import BrushChart from "./BrushChart";

export function BrushChart2View({
  controller,
}: {
  controller: BrushChart2Controller;
}) {
  const component = controller.get() as BrushChart2Model;
  const [selected, setSelected] = useState("brush");

  return (
    <Box w={"100%"} h={"100%"} bg={"black"}>
      <Flex w={"100%"} bg={"black"} h={"50px"}>
        <IconButton
          aria-label='Search database'
          borderRadius={0}
          w={"30%"}
          m={2}
          size={"sm"}
          color={"white"}
          _hover={{ bg: "#1F1F1F" }}
          _active={{ bg: "#676767" }}
          bg={selected === "brush" ? "#1F1F1F" : ""}
          borderColor={selected === "brush" ? "#676767" : ""}
          borderWidth={selected === "brush" ? "1px" : ""}
          _focus={{ borderColor: "#676767" }}
          onClick={() => {
            setSelected("brush");
          }}
          icon={<BsBrush />}
        />
        <IconButton
          aria-label='Search database'
          borderRadius={0}
          w={"30%"}
          m={2}
          size={"sm"}
          color={"white"}
          _hover={{ bg: "#1F1F1F" }}
          _focus={{ borderColor: "#676767" }}
          _active={{ bg: "#676767" }}
          bg={selected === "pencil" ? "#1F1F1F" : ""}
          borderColor={selected === "pencil" ? "#676767" : ""}
          borderWidth={selected === "pencil" ? "1px" : ""}
          onClick={() => {
            setSelected("pencil");
          }}
          icon={<BsPencil />}
        />
        <IconButton
          aria-label='Search database'
          borderRadius={0}
          w={"30%"}
          m={2}
          size={"sm"}
          color={"white"}
          _hover={{ bg: "#1F1F1F" }}
          _focus={{ borderColor: "#676767" }}
          _active={{ bg: "#676767" }}
          bg={selected === "pen" ? "#1F1F1F" : ""}
          borderColor={selected === "pen" ? "#676767" : ""}
          borderWidth={selected === "pen" ? "1px" : ""}
          onClick={() => {
            setSelected("pen");
          }}
          icon={<BsPen />}
        />
        <IconButton
          aria-label='Search database'
          borderRadius={0}
          w={"30%"}
          m={2}
          size={"sm"}
          color={"white"}
          _hover={{ bg: "#1F1F1F" }}
          _focus={{ borderColor: "#676767" }}
          _active={{ bg: "#676767" }}
          bg={selected === "eraser" ? "#1F1F1F" : ""}
          borderColor={selected === "eraser" ? "#676767" : ""}
          borderWidth={selected === "eraser" ? "1px" : ""}
          onClick={() => {
            setSelected("eraser");
          }}
          icon={<BsEraser />}
        />

        <IconButton
          aria-label='Search database'
          borderRadius={0}
          w={"30%"}
          m={2}
          color={"white"}
          size={"sm"}
          _hover={{ bg: "#1F1F1F" }}
          _focus={{ borderColor: "#676767" }}
          _active={{ bg: "#676767" }}
          bg={selected === "text" ? "#1F1F1F" : ""}
          borderColor={selected === "text" ? "#676767" : ""}
          borderWidth={selected === "text" ? "1px" : ""}
          onClick={() => {
            setSelected("text");
          }}
          icon={<BsTextareaT />}
        />
        <IconButton
          aria-label='Search database'
          borderRadius={0}
          w={"30%"}
          m={2}
          color={"white"}
          size={"sm"}
          _hover={{ bg: "#1F1F1F" }}
          _focus={{ borderColor: "#676767" }}
          _active={{ bg: "#676767" }}
          bg={selected === "rectangle" ? "#1F1F1F" : ""}
          borderColor={selected === "rectangle" ? "#676767" : ""}
          borderWidth={selected === "rectangle" ? "1px" : ""}
          onClick={() => {
            setSelected("rectangle");
          }}
          icon={<BsBoundingBox />}
        />

        <IconButton
          aria-label='Search database'
          borderRadius={0}
          w={"30%"}
          m={2}
          color={"white"}
          size={"sm"}
          _hover={{ bg: "#1F1F1F" }}
          _active={{ bg: "#676767" }}
          _focus={{ borderColor: "#676767" }}
          bg={selected === "highlighter" ? "#1F1F1F" : ""}
          borderColor={selected === "highlighter" ? "#676767" : ""}
          borderWidth={selected === "highlighter" ? "1px" : ""}
          onClick={() => {
            setSelected("highlighter");
          }}
          icon={<AiOutlineHighlight />}
        />
        <IconButton
          aria-label='Search database'
          borderRadius={0}
          w={"30%"}
          m={2}
          color={"white"}
          size={"sm"}
          _hover={{ bg: "#1F1F1F" }}
          _active={{ bg: "#676767" }}
          _focus={{ borderColor: "#676767" }}
          bg={selected === "circle" ? "#1F1F1F" : ""}
          borderColor={selected === "circle" ? "#676767" : ""}
          borderWidth={selected === "circle" ? "1px" : ""}
          onClick={() => {
            setSelected("circle");
          }}
          icon={<BsCircle />}
        />

        <IconButton
          aria-label='Search database'
          borderRadius={0}
          w={"30%"}
          m={2}
          color={"white"}
          _hover={{ bg: "#1F1F1F" }}
          size={"sm"}
          _focus={{ borderColor: "#676767" }}
          _active={{ bg: "#676767" }}
          bg={selected === "trash" ? "#1F1F1F" : ""}
          borderColor={selected === "trash" ? "#676767" : ""}
          borderWidth={selected === "trash" ? "1px" : ""}
          onClick={() => {
            setSelected("trash");
          }}
          icon={<BsTrash />}
        />
        <IconButton
          aria-label='Search database'
          borderRadius={0}
          w={"30%"}
          m={2}
          color={"white"}
          _hover={{ bg: "#1F1F1F" }}
          size={"sm"}
          _active={{ bg: "#676767" }}
          _focus={{ borderColor: "#676767" }}
          bg={selected === "zoomin" ? "#1F1F1F" : ""}
          borderColor={selected === "zoomin" ? "#676767" : ""}
          borderWidth={selected === "zoomin" ? "1px" : ""}
          onClick={() => {
            setSelected("zoomin");
          }}
          icon={<BsZoomIn />}
        />
        <IconButton
          aria-label='Search database'
          borderRadius={0}
          w={"30%"}
          m={2}
          size={"sm"}
          color={"white"}
          _hover={{ bg: "#1F1F1F" }}
          _focus={{ borderColor: "#676767" }}
          _active={{ bg: "#676767" }}
          bg={selected === "zoomout" ? "#1F1F1F" : ""}
          borderColor={selected === "zoomout" ? "#676767" : ""}
          borderWidth={selected === "zoomout" ? "1px" : ""}
          onClick={() => {
            setSelected("zoomout");
          }}
          icon={<BsZoomOut />}
        />
      </Flex>
      <Flex
        w={"100%"}
        h={"100%"}
        bg={"black"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <BrushChart></BrushChart>
      </Flex>
    </Box>
  );
}
