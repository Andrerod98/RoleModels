import React, { useState } from "react";
import { SlidesListModel } from ".";
import {
  Box,
  Flex,
  Table,
  Tbody,
  Image,
  Td,
  Th,
  Thead,
  Text,
  Tr,
} from "@chakra-ui/react";
import { SlidesListController } from "./SlidesListController";

export function SlidesListView({
  controller,
}: {
  controller: SlidesListController;
}) {
  const component = controller.get() as SlidesListModel;

  const slides = [
    "public/ppt/slide1.png",
    "public/ppt/slide2.png",
    "public/ppt/slide3.png",
    "public/ppt/slide4.png",
    "public/ppt/slide5.png",
    "public/ppt/slide6.png",
    "public/ppt/slide7.png",
    "public/ppt/slide8.png",
    "public/ppt/slide9.png",
    "public/ppt/slide10.png",
  ];

  const [selected, setSelected] = useState(slides[0]);
  return (
    <Flex flexDirection={"column"} p={"10px"} h={"100%"} overflowY={"scroll"}>
      {slides.map((slide, index) => (
        <Flex>
          <Text fontWeight={"bold"}>{index + 1}</Text>
          <Box
            w={"180px"}
            h={"100px"}
            borderColor={selected === slide ? "red" : "black"}
            borderWidth={selected === slide ? "3px" : "1px"}
            boxShadow={"md"}
            m={2}
          >
            <Image
              src={slide}
              alt='asdas'
              w={"180px"}
              h={selected === slide ? "94px" : "96px"}
              onClick={() => {
                setSelected(slide);
              }}
            />
          </Box>
        </Flex>
      ))}
    </Flex>
  );
}
