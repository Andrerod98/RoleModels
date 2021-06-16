/* eslint-disable @typescript-eslint/no-empty-function */
import {
  IconButton,
  Box,
  Text,
  Badge,
  CloseButton,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Log, Logger } from "./Logger";
interface LogginWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoggingWindow = (props: LogginWindowProps) => {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const onChange = () => {
      console.log("The logging has changed...");
      setLogs(Logger.getInstance().getLogs());
    };
    Logger.getInstance().on("change", onChange);

    onChange();
    return () => {
      Logger.getInstance().off("change", onChange);
    };
  }, []);

  const color = useColorModeValue("white", "gray.800");

  return (
    <Box
      zIndex={10}
      position={"absolute"}
      rounded={"md"}
      bottom={0}
      boxShadow={"2xl"}
      borderTop={"1px"}
      borderColor={"gray.200"}
      bg={color}
      h={"25vh"}
      w={"100vw"}
      overflowY={"scroll"}
      display={props.isOpen ? "block" : "none"}
    >
      <IconButton
        position={"absolute"}
        right={"3"}
        top={"3"}
        size={"xs"}
        aria-label={"Search database"}
        icon={<CloseButton />}
        onClick={() => {
          props.onClose();
        }}
      />
      <Divider />
      <Table variant={"striped"} size={"sm"} mt={3}>
        <Thead>
          <Tr>
            <Th>Logs</Th>
            <Th></Th>
          </Tr>
        </Thead>

        <Tbody>
          {logs.reverse().map((log, index) => {
            const colors = {
              error: "red",
              warning: "yellow",
              info: "blue",
            } as { [type: string]: string };
            const color = colors[log.type];
            return (
              <Tr key={"row-" + index}>
                <Td>
                  <Flex>
                    <Badge colorScheme={color} mr={5}>
                      {log.type}
                    </Badge>
                  </Flex>
                </Td>
                <Td>
                  <Flex w={"90vw"}>
                    <Text mr={5}>{log.date}</Text>
                    {log.value}
                  </Flex>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};
