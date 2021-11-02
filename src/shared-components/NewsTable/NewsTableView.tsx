import React from "react";
import { NewsTableModel } from ".";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { NewsTableController } from "./NewsTableController";

export function NewsTableView({
  controller,
}: {
  controller: NewsTableController;
}) {
  const component = controller.get() as NewsTableModel;

  const news = [
    "Stocks up slightly as Wall Street aims to build on records after October rally.",
    "Barclays sees modest pressure after CEO quits over Epstein ties",
    "Harley-Davidson shares rally on U.S.-E.U. tariff deal",
    "Former SpaceX engineers founded a company to build ‘climate-friendly, cost-effective’ portable nuclear reactors",
    "AMC says October was best for ticket revenue since start of the pandemic",
  ];
  return (
    <Table
      {...component}
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
  );
}
