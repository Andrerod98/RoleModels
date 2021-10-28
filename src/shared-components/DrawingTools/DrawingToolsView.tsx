import React, { useState } from "react";
import { DrawingToolsModel } from ".";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import { DrawingToolsController } from "./DrawingToolsController";
import { AiOutlineHighlight } from "react-icons/ai";
import {
  BsBrush,
  BsPencil,
  BsPen,
  BsEraser,
  BsPaintBucket,
  BsTextareaT,
  BsBoundingBox,
  BsEyedropper,
  BsCircle,
  BsTrash,
  BsZoomIn,
  BsZoomOut,
} from "react-icons/bs";
import { IoColorWandOutline } from "react-icons/io5";

export function DrawingToolsView({
  controller,
}: {
  controller: DrawingToolsController;
}) {
  const component = controller.get() as DrawingToolsModel;

  const [selected, setSelected] = useState("brush");
  return (
    <Flex w={"100%"} h={"100vh"} bg={"#323232"} p={2} flexDirection={"column"}>
      <Text color={"white"} fontWeight={"bold"} w={"100%"} textAlign={"center"}>
        Tools
      </Text>
      <Flex flexWrap={"wrap"} justifyContent={"space-evenly"}>
        <IconButton
          aria-label='Search database'
          borderRadius={0}
          w={"30%"}
          m={2}
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
          _hover={{ bg: "#1F1F1F" }}
          _focus={{ borderColor: "#676767" }}
          _active={{ bg: "#676767" }}
          bg={selected === "bucket" ? "#1F1F1F" : ""}
          borderColor={selected === "bucket" ? "#676767" : ""}
          borderWidth={selected === "bucket" ? "1px" : ""}
          onClick={() => {
            setSelected("bucket");
          }}
          icon={<BsPaintBucket />}
        />
        <IconButton
          aria-label='Search database'
          borderRadius={0}
          w={"30%"}
          m={2}
          color={"white"}
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
          _hover={{ bg: "#1F1F1F" }}
          _focus={{ borderColor: "#676767" }}
          _active={{ bg: "#676767" }}
          bg={selected === "colorpicker" ? "#1F1F1F" : ""}
          borderColor={selected === "colorpicker" ? "#676767" : ""}
          borderWidth={selected === "colorpicker" ? "1px" : ""}
          onClick={() => {
            setSelected("colorpicker");
          }}
          icon={<BsEyedropper />}
        />
        <IconButton
          aria-label='Search database'
          borderRadius={0}
          w={"30%"}
          m={2}
          color={"white"}
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
          _active={{ bg: "#676767" }}
          _focus={{ borderColor: "#676767" }}
          bg={selected === "wand" ? "#1F1F1F" : ""}
          borderColor={selected === "wand" ? "#676767" : ""}
          borderWidth={selected === "wand" ? "1px" : ""}
          onClick={() => {
            setSelected("wand");
          }}
          icon={<IoColorWandOutline />}
        />
        <IconButton
          aria-label='Search database'
          borderRadius={0}
          w={"30%"}
          m={2}
          color={"white"}
          _hover={{ bg: "#1F1F1F" }}
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
    </Flex>
  );
}
