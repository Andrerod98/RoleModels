import {
  Box,
  Button,
  Center,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Stack,
  StackDivider,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { FC, useState } from "react";
import QrReader from "react-qr-reader";
import { CrossDeviceApplication } from "../../Application";
import Utils from "../../utils/utils";
import { CgScreenMirror, CgArrowsExpandDownRight } from "react-icons/cg";
import { AiOutlineExpand } from "react-icons/ai";

interface FocusButtonProps {
  app: CrossDeviceApplication;
}
export const FocusButton: FC<FocusButtonProps> = (props: FocusButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [view, setView] = useState(undefined);

  const [grid, setGrid] = useState({ columns: 1, rows: 1 });

  const rows = [];

  for (let k = 0; k < grid.columns; k++) {
    for (let i = 0; i < grid.rows; i++) {
      rows.push(i);
    }
  }
  return (
    <>
      <IconButton
        aria-label={"Focus"}
        icon={<Icon as={AiOutlineExpand} />}
        onClick={() => {
          setView(undefined);
          onOpen();
        }}
      />
      <Modal isOpen={isOpen} onClose={onClose} size={"full"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              {view !== undefined ? (
                <VStack
                  divider={<StackDivider borderColor={"gray.200"} />}
                  spacing={4}
                  align={"stretch"}
                >
                  {/* <Box transform={"scale(0.5,0.5)"}>
                    <ViewComponent
                      key={"new"}
                      view={view}
                      qrUrl={props.app.getFullHost() + "&viewId=details-view"}
                      x={0}
                      y={0}
                    />
              </Box>*/}

                  <Button
                    rightIcon={<CgArrowsExpandDownRight />}
                    onClick={() => {
                      props.app.grabView(view);

                      onClose();
                    }}
                    colorScheme={"blue"}
                    width={"300px"}
                    size={"lg"}
                  >
                    Migrate
                  </Button>
                  <Button
                    rightIcon={<CgScreenMirror />}
                    onClick={() => {
                      props.app.getMyRole().addView(view);
                      props.app.mirrorViews(view, view);

                      onClose();
                    }}
                    width={"300px"}
                    size={"lg"}
                  >
                    Mirror
                  </Button>
                  <Box>
                    Stitching
                    <Stack shouldWrapChildren direction={"row"}>
                      <NumberInput
                        size={"sm"}
                        min={0}
                        max={3}
                        onChange={(
                          valueAsString: string,
                          valueAsNumber: number
                        ) =>
                          setGrid({ columns: valueAsNumber, rows: grid.rows })
                        }
                        value={grid.columns}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>

                      <NumberInput
                        size={"sm"}
                        min={0}
                        max={3}
                        onChange={(
                          valueAsString: string,
                          valueAsNumber: number
                        ) =>
                          setGrid({
                            columns: grid.columns,
                            rows: valueAsNumber,
                          })
                        }
                        value={grid.rows}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </Stack>
                    <SimpleGrid columns={grid.rows} spacing={5} mt={5}>
                      {rows.map((r, index) => (
                        <Center key={"grid-row-" + index}>
                          <Button
                            onClick={() => {
                              props.app.getMyRole().addView(view);
                              const positions = {};

                              positions[props.app.getMyRole().getName()] =
                                index + 1;

                              props.app.stitchViews(
                                grid.columns,
                                grid.rows,
                                positions,
                                view,
                                view
                              );

                              onClose();
                              props.app.reRender();
                            }}
                            width={"100px"}
                            height={"100px"}
                            size={"lg"}
                          >
                            {index + 1}
                          </Button>
                        </Center>
                      ))}
                    </SimpleGrid>
                  </Box>
                </VStack>
              ) : (
                <QrReader
                  delay={300}
                  onError={() => {
                    return console.log("Error");
                  }}
                  onScan={(data: string) => {
                    console.log(data);
                    if (data !== null) {
                      if (Utils.validURL(data)) {
                        window.location.href = data;
                        window.location.reload();
                      } else {
                        if (data.startsWith("view/")) {
                          const value = data.substr(5);
                          const view = props.app
                            .getSharedObject()
                            .getView(value);
                          setView(view);
                        } else if (data.startsWith("qr/")) {
                          const value = data.substr(3);
                          props.app.getSharedObject().getQRCode(value).scan();
                          onClose();
                        } else if (data.startsWith("combined/view/")) {
                          const value = data.substr(14);
                          props.app
                            .getSharedObject()
                            .getRole()
                            .addCombinedView(value);
                          onClose();
                        }
                      }
                    }
                  }}
                  style={{ width: "100%" }}
                />
              )}
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
