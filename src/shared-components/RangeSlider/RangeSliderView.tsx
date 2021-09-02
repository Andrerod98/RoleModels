import React from "react";
import { RangeSliderModel } from ".";
import {
  Box,
  Heading,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import { RangeSliderController } from "./RangeSliderController";
import AppleStockData from "../../mocks/apple/stock.json";
import AmazonStockData from "../../mocks/amazon/stock.json";
import MicrosoftStockData from "../../mocks/microsoft/stock.json";

export function RangeSliderView({
  controller,
}: {
  controller: RangeSliderController;
}) {
  const { value, ...component } = controller.get() as RangeSliderModel;

  const data1 = AppleStockData.dataset.data;
  const data2 = AmazonStockData.dataset.data;
  const data3 = MicrosoftStockData.dataset.data;

  const dataMapping = {
    apple: { data: data1, symbol: "AAPL", value: 151.83, percentage: 2.45 },
    amazon: { data: data2, symbol: "AMZN", value: 3470.79, percentage: 1.68 },
    microsoft: { data: data3, symbol: "MSFT", value: 301.48, percentage: 4 },
  };

  const data = dataMapping[component.stock].data[0];

  return (
    <Box h={"100vh"} w={"100vw"}>
      <Heading>Stocks</Heading>
      <StatGroup>
        <Stat>
          <StatLabel>Stock symbol:</StatLabel>
          <StatNumber>{dataMapping[component.stock].symbol}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Current Value:</StatLabel>
          <StatNumber>{dataMapping[component.stock].value}$</StatNumber>
          <StatHelpText>
            <StatArrow type='increase' />
            {dataMapping[component.stock].percentage}%
          </StatHelpText>
        </Stat>
      </StatGroup>
      <Table size='sm'>
        <Tbody>
          <Tr>
            <Td>Date</Td>
            <Td>{data[0]}</Td>
          </Tr>
          <Tr>
            <Td>Open</Td>
            <Td>{data[1]}</Td>
          </Tr>
          <Tr>
            <Td>High</Td>
            <Td>{data[2]}</Td>
          </Tr>
          <Tr>
            <Td>Low</Td>
            <Td>{data[3]}</Td>
          </Tr>
          <Tr>
            <Td>Close</Td>
            <Td>{data[4]}</Td>
          </Tr>
          <Tr>
            <Td>Volume</Td>
            <Td>{data[5]}</Td>
          </Tr>
          <Tr>
            <Td>Ex-Dividend</Td>
            <Td>{data[6]}</Td>
          </Tr>
          <Tr>
            <Td>Split-Ratio</Td>
            <Td>{data[7]}</Td>
          </Tr>
          <Tr>
            <Td>Adj. Open</Td>
            <Td>{data[8]}</Td>
          </Tr>
          <Tr>
            <Td>Adj. High</Td>
            <Td>{data[9]}</Td>
          </Tr>
          <Tr>
            <Td>Adj. Low</Td>
            <Td>{data[10]}</Td>
          </Tr>
          <Tr>
            <Td>Adj. Close</Td>
            <Td>{data[11]}</Td>
          </Tr>
          <Tr>
            <Td>Adj. Volume</Td>
            <Td>{data[12]}</Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
}
