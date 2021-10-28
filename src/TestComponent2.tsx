import {
  Box,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Image,
  Spacer,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  AiOutlineDown,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineUp,
} from "react-icons/ai";
import {
  BiArrowBack,
  BiHome,
  BiMicrophone,
  BiTargetLock,
} from "react-icons/bi";
import { BsBrush, BsFullscreen, BsPower } from "react-icons/bs";
import { HiFastForward, HiPlay, HiRewind } from "react-icons/hi";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { MdRadioButtonChecked } from "react-icons/md";

export const TestComponent2 = () => {
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
    <Box w={"100vw"} h={"100vh"}>
      <Flex w={"100%"} h={"110px"} bg={"#E5E5E5"} alignItems={"center"}>
        <Image
          src={"/public/ppt-header.png"}
          alt='asdas'
          w={"100%"}
          h={"110px"}
        />
        {/*headers.map((head) => (
          <IconButton
            aria-label='Search database'
            borderRadius={0}
            m={2}
            size={"sm"}
            color={"black"}
            _hover={{ bg: "gray.400" }}
            _active={{ bg: "gray.400" }}
            bg={selected === head.name ? "gray.400" : ""}
            borderColor={selected === head.name ? "#676767" : ""}
            borderWidth={selected === head.name ? "1px" : ""}
            _focus={{ borderColor: "#676767" }}
            onClick={() => {
              setSelected(head.name);
            }}
            icon={head.icon}
          />
        ))*/}
      </Flex>
      <Flex w={"100%"} h={"100%"}>
        <Flex
          flexDirection={"column"}
          p={"10px"}
          h={"100%"}
          overflowY={"scroll"}
        >
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
        <Box bg={"#EEEEEE"} p={"40px"} w={"70%"} h={"100%"}>
          <Image src={selected} alt='asdas' boxShadow={"md"} />
          <Flex>
            <Spacer />
            <IconButton
              aria-label='Search database'
              borderRadius={0}
              colorScheme={"blue"}
              m={2}
              variant='outline'
              size={"sm"}
              icon={<IoChevronBack />}
            />
            <IconButton
              aria-label='Search database'
              borderRadius={0}
              colorScheme={"blue"}
              variant='outline'
              m={2}
              size={"sm"}
              icon={<IoChevronForward />}
            />
            <Spacer />
            <IconButton
              aria-label='Search database'
              borderRadius={0}
              colorScheme={"blue"}
              variant='outline'
              size={"sm"}
              mt={2}
              icon={<BsFullscreen />}
            />
          </Flex>{" "}
          <Box
            w={"100%"}
            h={"80px"}
            boxShadow={"xs"}
            p={5}
            borderColor={"black"}
            borderWidth={"1px"}
          >
            <Text>Notes</Text>
          </Box>
        </Box>
        <Flex
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          bg={"gray.900"}
          h={"450px"}
          borderRadius={"10px"}
        >
          <IconButton
            aria-label='Search database'
            borderRadius={40}
            colorScheme={"red"}
            m={2}
            icon={<BsPower />}
          />

          <Flex>
            {" "}
            <IconButton
              aria-label='Search database'
              borderRadius={0}
              bg={"black"}
              color={"white"}
              m={2}
              icon={<BiArrowBack />}
            />{" "}
            <IconButton
              aria-label='Search database'
              borderRadius={0}
              bg={"black"}
              color={"white"}
              m={2}
              icon={<BiHome />}
            />
          </Flex>
          <Grid
            h='100px'
            templateRows='repeat(3, 1fr)'
            templateColumns='repeat(3, 1fr)'
            m={2}
          >
            <GridItem rowSpan={1} colSpan={1} bg=''></GridItem>
            <GridItem rowSpan={1} colSpan={1} bg='white'>
              <IconButton
                aria-label='Search database'
                borderRadius={0}
                colorScheme={"purple"}
                icon={<AiOutlineUp />}
              />
            </GridItem>
            <GridItem rowSpan={1} colSpan={1} bg=''></GridItem>
            <GridItem rowSpan={1} colSpan={1} bg='white'>
              <IconButton
                aria-label='Search database'
                borderRadius={0}
                colorScheme={"purple"}
                icon={<AiOutlineLeft />}
              />
            </GridItem>
            <GridItem rowSpan={1} colSpan={1} bg='white'>
              <IconButton
                aria-label='Search database'
                borderRadius={0}
                colorScheme={"purple"}
                icon={<MdRadioButtonChecked />}
              />
            </GridItem>
            <GridItem rowSpan={1} colSpan={1} bg='white'>
              <IconButton
                aria-label='Search database'
                borderRadius={0}
                colorScheme={"purple"}
                icon={<AiOutlineRight />}
              />
            </GridItem>
            <GridItem rowSpan={1} colSpan={1} bg=''></GridItem>
            <GridItem rowSpan={1} colSpan={1} bg='white'>
              <IconButton
                aria-label='Search database'
                borderRadius={0}
                colorScheme={"purple"}
                icon={<AiOutlineDown />}
              />
            </GridItem>
            <GridItem rowSpan={1} colSpan={1} bg=''></GridItem>
          </Grid>
          <Flex mx={2} mt={8}>
            {" "}
            <IconButton
              aria-label='Search database'
              borderRadius={0}
              bg={"black"}
              color={"white"}
              icon={<BiTargetLock />}
            />{" "}
            <IconButton
              aria-label='Search database'
              borderRadius={0}
              bg={"black"}
              color={"white"}
              icon={<BiMicrophone />}
            />
            <IconButton
              aria-label='Search database'
              borderRadius={0}
              bg={"black"}
              color={"white"}
              icon={<BiHome />}
            />
          </Flex>
          <Flex m={2}>
            {" "}
            <IconButton
              aria-label='Search database'
              borderRadius={0}
              bg={"black"}
              color={"white"}
              icon={<HiRewind />}
            />{" "}
            <IconButton
              aria-label='Search database'
              borderRadius={0}
              bg={"black"}
              color={"white"}
              icon={<HiPlay />}
            />
            <IconButton
              aria-label='Search database'
              borderRadius={0}
              bg={"black"}
              color={"white"}
              icon={<HiFastForward />}
            />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};
