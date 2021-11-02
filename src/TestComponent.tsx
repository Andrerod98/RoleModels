import {
  Box,
  Button,
  Flex,
  IconButton,
  Progress,
  Spacer,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
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
import { XYChartView } from "./XYChartView";

export const TestComponent = () => {
  const [selected, setSelected] = useState("brush");

  const news = [
    "The S&P crashed.",
    "The S&P crashed.",
    "The S&P crashed.",
    "The S&P crashed.",
    "The S&P crashed.",
  ];
  const [stocks, setStocks] = useState([
    {
      symbol: "AAPL",
      last: 0,
      change: 0.38,
      open: 0,
      high: 0,
      low: 0,
      vol: 0,
      perc: 20,
    },
    {
      symbol: "AAPL",
      last: 0,
      change: -0.49,
      open: 0,
      high: 0,
      low: 0,
      vol: 0,
      perc: 50,
    },
    {
      symbol: "AAPL",
      last: 0,
      change: 0,
      open: 0,
      high: 0,
      low: 0,
      vol: 0,
      perc: 80,
    },
    {
      symbol: "AAPL",
      last: 0,
      change: 0,
      open: 0,
      high: 0,
      low: 0,
      vol: 0,
      perc: 80,
    },
    {
      symbol: "AAPL",
      last: 0,
      change: 0,
      open: 0,
      high: 0,
      low: 0,
      vol: 0,
      perc: 80,
    },
    {
      symbol: "AAPL",
      last: 0,
      change: 0,
      open: 0,
      high: 0,
      low: 0,
      vol: 0,
      perc: 80,
    },
    {
      symbol: "AAPL",
      last: 0,
      change: 0,
      open: 0,
      high: 0,
      low: 0,
      vol: 0,
      perc: 80,
    },
    {
      symbol: "AAPL",
      last: 0,
      change: 0,
      open: 0,
      high: 0,
      low: 0,
      vol: 0,
      perc: 80,
    },
    {
      symbol: "AAPL",
      last: 0,
      change: 0,
      open: 0,
      high: 0,
      low: 0,
      vol: 0,
      perc: 80,
    },
    {
      symbol: "AAPL",
      last: 0,
      change: 0,
      open: 0,
      high: 0,
      low: 0,
      vol: 0,
      perc: 80,
    },
    {
      symbol: "AAPL",
      last: 0,
      change: 0,
      open: 0,
      high: 0,
      low: 0,
      vol: 0,
      perc: 80,
    },
    {
      symbol: "AAPL",
      last: 0,
      change: 0,
      open: 0,
      high: 0,
      low: 0,
      vol: 0,
      perc: 80,
    },
    {
      symbol: "AAPL",
      last: 0,
      change: 0,
      open: 0,
      high: 0,
      low: 0,
      vol: 0,
      perc: 80,
    },
    {
      symbol: "AAPL",
      last: 0,
      change: 0,
      open: 0,
      high: 0,
      low: 0,
      vol: 0,
      perc: 80,
    },
    {
      symbol: "AAPL",
      last: 0,
      change: 0,
      open: 0,
      high: 0,
      low: 0,
      vol: 0,
      perc: 80,
    },
  ]);

  const generateRandom = () => {
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }

    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    const newStock = [];
    for (const [index, stock] of stocks.entries()) {
      newStock[index] = {
        symbol: stock.symbol,
        last: stock.last,
        change: getRandomArbitrary(-20, 20).toFixed(2),
        open: stock.open,
        high: stock.high,
        low: stock.low,
        vol: stock.vol,
        perc: getRandomInt(0, 100),
      };
    }

    setStocks(newStock);
  };

  useEffect(() => {
    setTimeout(() => {
      generateRandom();
    }, 2000);
  });

  return (
    <Box>
      <Flex>
        <Table
          size='sm'
          w={"40vw"}
          h={"70vh"}
          variant='striped'
          colorScheme='blackAlpha'
          bg={"black"}
          color={"white"}
        >
          <Thead>
            <Tr>
              <Th>Symbol</Th>
              <Th isNumeric>Last</Th>
              <Th isNumeric>Change</Th>
              <Th isNumeric>Open</Th>
              <Th isNumeric>High</Th>
              <Th isNumeric>Low</Th>
              <Th isNumeric>Vol</Th>
              <Th>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            {stocks.map((stock) => (
              <Tr>
                <Td>{stock.symbol}</Td>
                <Td>{stock.last}</Td>
                <Td color={stock.change < 0 ? "red" : "lime"}>
                  {" "}
                  {stock.change}%
                </Td>
                <Td> {stock.open}</Td>
                <Td> {stock.high}</Td>
                <Td> {stock.low}</Td>
                <Td> {stock.vol}</Td>
                <Td>
                  <Progress
                    colorScheme={stock.change < 0 ? "red" : "green"}
                    value={stock.perc}
                    color={"white"}
                  ></Progress>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Box w={"50vw"}>
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
        <Flex w={"15vw"} bg={"black"} flexDirection={"column"}>
          <Table
            size='sm'
            w={"100%"}
            variant='striped'
            colorScheme='blackAlpha'
            color={"white"}
          >
            <Thead>
              <Tr>
                <Th>News</Th>
              </Tr>
            </Thead>
            <Tbody>
              {news.map((n) => (
                <Tr>
                  <Td>{n}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Spacer />
          <Text color={"#4A5667"} fontWeight={"bold"} fontSize={"12px"} m={2}>
            STOCKS
          </Text>
          <Button
            w={"90%"}
            color={"white"}
            _hover={{ bg: "#1F1F1F" }}
            _focus={{ borderColor: "#676767" }}
            _active={{ bg: "#676767" }}
            borderRadius={0}
            bg={selected === "bucket" ? "#1F1F1F" : ""}
            borderColor={"#676767"}
            borderWidth={"1px"}
            m={2}
          >
            Microsoft
          </Button>
          <Button
            w={"90%"}
            color={"white"}
            _hover={{ bg: "#1F1F1F" }}
            _focus={{ borderColor: "#676767" }}
            _active={{ bg: "#676767" }}
            borderRadius={0}
            bg={selected === "bucket" ? "#1F1F1F" : ""}
            borderColor={"#676767"}
            borderWidth={"1px"}
            m={2}
          >
            Apple
          </Button>
          <Button
            w={"90%"}
            color={"white"}
            _hover={{ bg: "#1F1F1F" }}
            _focus={{ borderColor: "#676767" }}
            _active={{ bg: "#676767" }}
            borderRadius={0}
            bg={selected === "bucket" ? "#1F1F1F" : ""}
            borderColor={"#676767"}
            borderWidth={"1px"}
            m={2}
          >
            Amazon
          </Button>
        </Flex>
      </Flex>
      <Flex>
        <Box w={"400px"} h={"200px"} bg={"black"} color={"white"}>
          <XYChartView
            type={"areaSeries"}
            stock={"all"}
            xVariable={"Date"}
            yVariable={"Open"}
            xDomain={["01-02-1998", "01-02-2021"]}
            yDomain={["0", "10000"]}
            color={["red", "green", "blue"]}
          />
        </Box>
        <Box w={"400px"} h={"200px"} bg={"black"} color={"white"}>
          <XYChartView
            type={"barSeries"}
            stock={"apple"}
            xVariable={"Date"}
            yVariable={"Open"}
            xDomain={["01-02-2017", "01-02-2021"]}
            yDomain={["0", "10000"]}
            color={["red", "green", "blue"]}
          />
        </Box>
        <Box w={"400px"} h={"200px"} bg={"black"} color={"white"}>
          <XYChartView
            type={"areaSeries"}
            stock={"apple"}
            xVariable={"Date"}
            yVariable={"Open"}
            xDomain={["01-02-2018", "01-02-2021"]}
            yDomain={["0", "10000"]}
            color={["blue", "green", "blue"]}
          />
        </Box>
        <Box w={"400px"} h={"200px"} bg={"black"} color={"white"}>
          <XYChartView
            type={"glyphSeries"}
            stock={"apple"}
            xVariable={"Date"}
            yVariable={"Open"}
            xDomain={["01-02-2000", "01-02-2021"]}
            yDomain={["0", "10000"]}
            color={["lime", "green", "blue"]}
          />
        </Box>
      </Flex>
    </Box>
  );
};
