import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Icon,
  IconButton,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  Text,
  Box,
  Center,
} from "@chakra-ui/react";
import React, { FC, useState } from "react";
import { AiOutlineExpand } from "react-icons/ai";
import { CgArrowsExpandDownRight, CgScreenMirror } from "react-icons/cg";
import QrReader from "react-qr-reader";
import { CrossDeviceApplication } from "../../Application";
import Utils from "../../utils/utils";

interface FocusButtonProps {
  app: CrossDeviceApplication;
}
export const TestInteractionModal: FC<FocusButtonProps> = (
  props: FocusButtonProps
) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [view, setView] = useState(undefined);

  return (
    <>
      <IconButton
        aria-label={"Focus"}
        icon={<Icon as={AiOutlineExpand} />}
        onClick={() => {
          onOpen();
          setView(undefined);
        }}
      />
      <Modal isOpen={isOpen} onClose={onClose} size={"full"}>
        <ModalOverlay />
        <ModalContent m={0} bg={"transparent"} position={"relative"} h={"100%"}>
          {view !== undefined ? (
            <>
              <Flex
                position={"absolute"}
                bottom={0}
                left={0}
                right={0}
                top={0}
                m={30}
                onClick={onClose}
                justifyContent={"space-around"}
              >
                <Button
                  m={"auto"}
                  w={"40%"}
                  h={"40%"}
                  onClick={(e) => {
                    e.stopPropagation();
                    props.app.grabView(view);

                    onClose();
                  }}
                >
                  <Box align={"center"}>
                    <Text fontSize={"40px"}> Migrate</Text>

                    <CgArrowsExpandDownRight fontSize={"60px"} />
                  </Box>
                </Button>
                <Button
                  m={"auto"}
                  w={"40%"}
                  h={"40%"}
                  onClick={(e) => {
                    e.stopPropagation();
                    props.app.getMyRole().addView(view);
                    props.app.mirrorViews(view, view);
                    onClose();
                  }}
                >
                  <Box align={"center"}>
                    <Text fontSize={"40px"}> Mirror</Text>

                    <CgScreenMirror fontSize={"60px"} />
                  </Box>
                </Button>
              </Flex>

              <Button
                position={"absolute"}
                top={0}
                left={"0"}
                right={"0"}
                m={"auto"}
                w={"90%"}
                h={"40px"}
                borderTopRadius={"0"}
                borderBottomRadius={"50px"}
              >
                <ChevronUpIcon></ChevronUpIcon>
              </Button>
              <Flex
                direction={"column"}
                position={"absolute"}
                left={"0"}
                h={"100%"}
                justifyContent={"center"}
              >
                <Button
                  w={"20px"}
                  h={"95%"}
                  borderLeftRadius={"0"}
                  borderRightRadius={"50px"}
                >
                  <ChevronLeftIcon />
                </Button>
              </Flex>
              <Flex
                direction={"column"}
                position={"absolute"}
                right={"0"}
                h={"100%"}
                justifyContent={"center"}
              >
                <Button
                  position={"absolute"}
                  right={0}
                  w={"40px"}
                  h={"95%"}
                  borderLeftRadius={"50px"}
                  borderRightRadius={"0"}
                >
                  <ChevronRightIcon />
                </Button>
              </Flex>
              <Button
                position={"absolute"}
                bottom={0}
                left={0}
                right={0}
                w={"90%"}
                h={"40px"}
                m={"auto"}
                borderTopRadius={"50px"}
                borderBottomRadius={"0"}
              >
                <ChevronDownIcon />
              </Button>
              <ModalCloseButton />
            </>
          ) : (
            <Center h={"100%"} onClick={onClose}>
              <Box
                borderWidth={"10px"}
                borderColor={"black"}
                width={"400px"}
                height={"400px"}
                position={"relative"}
              >
                <QrReader
                  showViewFinder={false}
                  style={{
                    width: "100%",
                  }}
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
                />
                <Box
                  position={"absolute"}
                  left={0}
                  right={0}
                  top={0}
                  bottom={0}
                  m={"auto"}
                >
                  <Center h={"100%"}>
                    <Box
                      w={"300px"}
                      h={"300px"}
                      bg={"transparent"}
                      backgroundRepeat={"no-repeat"}
                      backgroundSize={"20px 20px"}
                      background={`
                      linear-gradient(to right, white 4px, transparent 4px) 0 0,
                      linear-gradient(to right, white 4px, transparent 4px) 0 100%,
                      linear-gradient(to left, white 4px, transparent 4px) 100% 0,
                      linear-gradient(to left, white 4px, transparent 4px) 100% 100%,
                      linear-gradient(to bottom, white 4px, transparent 4px) 0 0,
                      linear-gradient(to bottom, white 4px, transparent 4px) 100% 0,
                      linear-gradient(to top, white 4px, transparent 4px) 0 100%,
                      linear-gradient(to top, white 4px, transparent 4px) 100% 100%;`}
                    ></Box>
                  </Center>
                </Box>
              </Box>
            </Center>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
