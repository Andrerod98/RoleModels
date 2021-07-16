/* eslint-disable @typescript-eslint/no-empty-function */
import { CloseIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Box,
  Text,
  Badge,
  Flex,
  Table,
  Tbody,
  Td,
  Tr,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Log, Logger } from "../shared-application/Logger";
interface LogginWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoggingWindow = (props: LogginWindowProps) => {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const onChange = () => {
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
      display={props.isOpen ? "block" : "none"}
    >
      <Text ml={5} my={"5px"}>
        LOGS
      </Text>

      <IconButton
        position={"absolute"}
        right={"2"}
        top={"1"}
        size={"xs"}
        aria-label={"Search database"}
        icon={<CloseIcon />}
        onClick={() => {
          props.onClose();
        }}
      />
      <Divider />
      <Box w={"100%"} h={"80%"} overflowY={"scroll"}>
        <Table variant={"striped"} size={"sm"}>
          <Tbody>
            {logs.map((log, index) => {
              const colors = {
                error: "red",
                warning: "yellow",
                info: "blue",
                success: "green",
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
    </Box>
  );
};
