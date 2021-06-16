/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { Box, Spacer, IconButton, Flex, useColorMode } from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

import { IoRefresh } from "react-icons/io5";
import { FullScreenWrapper } from "./FullScreenWrapper";
import { Preview } from "./Preview";
import React from "react";
import { View } from "../../../../prototyping-tool/shared-object/views/View";
interface PreviewerProps {
  views: View[];
  handleClick: () => void;
  onChangeView: (newView: View) => void;
  onChangeViews: (newViews: View[]) => void;
}

export const Previewer = (props: PreviewerProps) => {
  const [items, setItems] = useState(
    props.views.map((v: View) => ({ id: uuidv4(), view: v }))
  );

  useEffect(() => {
    setItems(props.views.map((v: View) => ({ id: uuidv4(), view: v })));
  }, [props.views]);

  const handleItemDelete = (i: any) => {
    const index = items.findIndex((item: any) => item.id === i.id);

    items.splice(index, 1);
    setItems((items: { id: string; view: View }[]) => {
      props.onChangeViews(items.map((v) => v.view));
      return [...items];
    });
  };

  const handleItemChange = (i: any, row: number, col: number) => {
    const index = items.findIndex((item: any) => item.id === i.id);
    const item = items[index];
    if (row > 0 && item.view.getRows() >= 12) item.view.setRows(12);
    else if (row < 0 && item.view.getRows() <= 0) item.view.setRows(0);
    else item.view.setRows(item.view.getRows() + row);

    if (col < 0 && item.view.getColumns() >= 12) item.view.setColumns(12);
    else if (col < 0 && item.view.getColumns() <= 0) item.view.setColumns(0);
    else item.view.setColumns(item.view.getColumns() + col);

    props.onChangeView(item.view);

    setItems([...items]);
  };

  const handleItemMove = (fromId: number, toId: number) => {
    setItems((items: { id: string; view: View }[]) => {
      const oldIndex = items.findIndex((item: any) => item.id === fromId);
      const newIndex = items.findIndex((item: any) => item.id === toId);

      const values = arrayMove(items, oldIndex, newIndex);
      props.onChangeViews(values.map((v) => v.view));
      return values;
    });
  };

  const { colorMode } = useColorMode();

  return (
    <Box w={"100%"} h={"100%"} m={2}>
      <Box position={"relative"} w={"100%"} h={"100%"} mb={"15px"}>
        <Flex>
          <IconButton
            aria-label={"Search database"}
            size={"sm"}
            onClick={props.handleClick}
            mb={2}
            icon={<IoRefresh></IoRefresh>}
          />
          <Spacer></Spacer>

          <FullScreenWrapper>
            <Preview
              width={"100%"}
              height={"100%"}
              items={items}
              onItemMove={handleItemMove}
              onItemChange={handleItemChange}
              onItemDelete={handleItemDelete}
            />
          </FullScreenWrapper>
        </Flex>
        <Box
          w={"920px"}
          h={"500px"}
          boxShadow={"xs"}
          bg={colorMode === "light" ? "white" : "gray.700"}
          overflow={"hidden"}
          position={"relative"}
        >
          <Preview
            width={"920px"}
            height={"500px"}
            items={items}
            onItemMove={handleItemMove}
            onItemChange={handleItemChange}
            onItemDelete={handleItemDelete}
          />
        </Box>
      </Box>
    </Box>
  );
};
