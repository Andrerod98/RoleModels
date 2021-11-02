import React, { useEffect, useState } from "react";
import { StockTableModel } from ".";
import { Progress, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { StockTableController } from "./StockTableController";

export function StockTableView({
  controller,
}: {
  controller: StockTableController;
}) {
  const component = controller.get() as StockTableModel;

  const [stocks, setStocks] = useState([
    {
      symbol: "MSFT",
      last: 328.56,
      change: -0.92,
      open: 328.56,
      high: 634.0,
      low: 300.0,
      vol: 100000000,
      perc: 10,
    },
    {
      symbol: "AAPL",
      last: 148.66,
      change: -1.14,
      open: 148.0,
      high: 201.23,
      low: 140.92,
      vol: 200000000,
      perc: 20,
    },
    {
      symbol: "AMZN",
      last: 3336.28,
      change: -1.07,
      open: 3330,
      high: 3600,
      low: 3200,
      vol: 300000000,
      perc: 5,
    },
    {
      symbol: "TSLA",
      last: 1132,
      change: 1.63,
      open: 1243,
      high: 1837,
      low: 1002,
      vol: 29183247,
      perc: 20,
    },
    {
      symbol: "GOOGL",
      last: 2924,
      change: -1.24,
      open: 2920,
      high: 3023,
      low: 2903,
      vol: 129328148,
      perc: 10,
    },
    {
      symbol: "FB",
      last: 330.79,
      change: 2.23,
      open: 324,
      high: 365,
      low: 302,
      vol: 12847128,
      perc: 20,
    },
    {
      symbol: "NVDA",
      last: 254.26,
      change: -0.55,
      open: 254.0,
      high: 260.23,
      low: 209.3,
      vol: 213871284,
      perc: 4,
    },
    {
      symbol: "BRK.B",
      last: 287.09,
      change: 0.03,
      open: 286.32,
      high: 302.0,
      low: 250.0,
      vol: 238127371,
      perc: 80,
    },
    {
      symbol: "JPM",
      last: 170.97,
      change: 0.64,
      open: 169.3,
      high: 206.2,
      low: 140.2,
      vol: 2138714571,
      perc: 20,
    },
    {
      symbol: "UNH",
      last: 462.44,
      change: 0.43,
      open: 460.0,
      high: 503.2,
      low: 400.4,
      vol: 11381273126,
      perc: 40,
    },
    {
      symbol: "JNJ",
      last: 163.46,
      change: 0.36,
      open: 160.32,
      high: 190.3,
      low: 140.2,
      vol: 301293129,
      perc: 7,
    },
    {
      symbol: "HD",
      last: 371.09,
      change: -0.17,
      open: 372.3,
      high: 390.4,
      low: 302.5,
      vol: 1238214421,
      perc: 20,
    },
    {
      symbol: "V",
      last: 213.22,
      change: 0.68,
      open: 210.0,
      high: 240.23,
      low: 205.29,
      vol: 123817238,
      perc: 10,
    },
    {
      symbol: "BAC",
      last: 47.59,
      change: -0.4,
      open: 48.3,
      high: 50.3,
      low: 39.4,
      vol: 1328417281,
      perc: 8,
    },
    {
      symbol: "ADBE",
      last: 646.44,
      change: -0.6,
      open: 650.4,
      high: 690.2,
      low: 605.2,
      vol: 2183217230,
      perc: 10,
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
