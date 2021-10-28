import React, { useState } from "react";
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
    "S&P has crashed!!",
    "S&P has crashed!!",
    "S&P has crashed!!",
    "S&P has crashed!!",
    "S&P has crashed!!",
  ];
  return (
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
  );
}
