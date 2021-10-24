import {
  Box,
  Center,
  CloseButton,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Tab,
  useTab,
} from "@chakra-ui/react";
import React from "react";

export function EditableTab(props: any) {
  // 2. Reuse the `useTab` hook
  const tabProps = useTab(props);
  const isSelected = !!tabProps["aria-selected"];

  return (
    <Tab
      {...tabProps}
      _hover={{ bg: "gray.200" }}
      bg={isSelected ? "gray.100" : "white"}
    >
      <Box>
        <Flex my={"2px"} mx={"1px"}>
          {isSelected ? (
            <Editable
              onClick={(e) => {
                e.stopPropagation();
                props.onClick();
              }}
              onSubmit={(nextValue) => {
                props.onSubmit(nextValue);
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              defaultValue={tabProps.title as string}
            >
              <EditablePreview />
              <EditableInput />
            </Editable>
          ) : (
            <Box m={"2px"}>{tabProps.title}</Box>
          )}
          <Box w={"24px"} h={"24px"} ml={"4px"}>
            <Center>
              <CloseButton
                size={"sm"}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onClose();
                }}
              />
            </Center>
          </Box>
        </Flex>
      </Box>
    </Tab>
  );
}
