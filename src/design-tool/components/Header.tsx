/* eslint-disable @typescript-eslint/no-empty-function */
import { ChevronDownIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  useColorMode,
  useDisclosure,
  Tab,
  TabList,
  Icon,
  IconButton,
  HStack,
  Center,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Link as ReactLink } from "react-router-dom";
import { BiDevices, BiMobileAlt } from "react-icons/bi";
import { RiFileListLine } from "react-icons/ri";
import { Logger } from "./Logger";

interface HeaderProps {
  onSaveProject: () => void;
  onOpenProject: () => void;
  onChangeTemplate: () => void;
  onPrototype: () => void;
  onLoggingOpen: () => void;
}
export const Header = (props: HeaderProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = useState(false);
  const cancelRef = React.useRef();

  return (
    <Box py={2} boxShadow={"xs"} h={"7vh"}>
      <HStack
        align={"stretch"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box px={"5"}>
          <Menu>
            <MenuButton
              px={2}
              py={1}
              transition={"all 0.2s"}
              borderRadius={"md"}
              borderWidth={"1px"}
              _hover={{ bg: "gray.400" }}
              _expanded={{ bg: "blue.400" }}
              _focus={{ boxShadow: "outline" }}
            >
              Project <ChevronDownIcon />
            </MenuButton>
            <MenuList>
              {/*<MenuItem as={ReactLink} to={"/"} onClick={onOpen}>
                New Project
  </MenuItem>*/}
              <MenuItem onClick={onOpen}>New Project</MenuItem>
              <MenuItem onClick={props.onOpenProject}>Open Project...</MenuItem>
              <MenuDivider />
              <MenuItem onClick={props.onChangeTemplate}>
                Change Template
              </MenuItem>
              <MenuItem onClick={props.onSaveProject}>Save Project</MenuItem>
            </MenuList>
          </Menu>
          <IconButton
            ml={"10px"}
            size={"sm"}
            aria-label={"Search database"}
            onClick={() => {
              Logger.getInstance().info(
                "The color was changed to " + colorMode
              );
              Logger.getInstance().warning(
                "The color was changed to " + colorMode
              );
              Logger.getInstance().error(
                "The color was changed to " + colorMode
              );
              toggleColorMode();
            }}
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          ></IconButton>
          <IconButton
            ml={"10px"}
            size={"sm"}
            aria-label={"Search database"}
            onClick={props.onLoggingOpen}
            icon={<RiFileListLine />}
          ></IconButton>
        </Box>
        <Box zIndex={2}>
          <Center>
            <TabList>
              <Tab>
                <Icon as={BiMobileAlt} />
              </Tab>
              <Tab>
                <Icon as={BiDevices} />
              </Tab>
            </TabList>
          </Center>
        </Box>
        <Box>
          {isLoading ? (
            <Spinner mr={"4"} />
          ) : (
            <Button
              colorScheme={"blue"}
              mr={"4"}
              onClick={() => {
                setLoading(true);
                props.onPrototype();
              }}
            >
              Prototype
            </Button>
          )}
        </Box>
      </HStack>
      <AlertDialog
        motionPreset={"slideInBottom"}
        leastDestructiveRef={cancelRef as any}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Discard Changes?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to discard this project and create a new
            project?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef as any} onClick={onClose}>
              No
            </Button>
            <Button colorScheme={"red"} ml={3} as={ReactLink} to={"/"}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
};
