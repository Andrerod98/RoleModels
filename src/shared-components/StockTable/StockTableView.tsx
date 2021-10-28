import React, { useEffect, useState } from "react";
import { StockTableModel } from ".";
import {
  Flex,
  IconButton,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { StockTableController } from "./StockTableController";

export function StockTableView({
  controller,
}: {
  controller: StockTableController;
}) {
  const component = controller.get() as StockTableModel;

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
    /*setTimeout(() => {
      generateRandom();
    }, 2000); */
  });
  return (
    <Table
      size='sm'
      w={component.width}
      h={component.height}
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
            <Td color={stock.change < 0 ? "red" : "lime"}> {stock.change}%</Td>
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
  );
}
