import { ChevronDownIcon, MoonIcon, SunIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerContent,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Tag,
  TagLabel,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import React, { FC } from "react";
import { CrossDeviceApplication } from "../../CrossDeviceApplication";
import { RiFileListLine, RiMusicLine } from "react-icons/ri";
import { FaPencilRuler } from "react-icons/fa";
import { TestInteractionModal } from "./InteractionModal";
import { Logger } from "../../Logger";

interface HeaderProps {
  roles: string[];
  myRole: string;
  onRoleClick: (role: string) => void;
  onManagerClick: () => void;
  onDesignClick: () => void;
  onLoggingOpen: () => void;
  app: CrossDeviceApplication;
}

export const Header: FC<HeaderProps> = (props: HeaderProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const btnRef = React.useRef();
  return (
    <>
      <IconButton
        ref={btnRef}
        aria-label={"Search database"}
        onClick={onOpen}
        icon={<ChevronDownIcon />}
      />
      <Drawer
        isOpen={isOpen}
        placement={"top"}
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        {/* <DrawerOverlay />*/}
        <DrawerContent>
          <Box bg={"#272B35"} h={"60px"} py={"10px"} px={"20px"}>
            <Flex>
              <Box key={"header-box"}>
                <Box display={{ base: "block", md: "none" }}>
                  <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                      {props.myRole}
                    </MenuButton>
                    <MenuList>
                      {props.roles.map((role, index) => {
                        if (role === "manager") {
                          return (
                            <MenuItem
                              key={"header-button-" + index}
                              mx={"5px"}
                              variant={"solid"}
                              onClick={() => props.onManagerClick()}
                            >
                              manager
                            </MenuItem>
                          );
                        } else if (role === "designer") {
                          <MenuItem
                            key={"header-button-" + index}
                            mx={"5px"}
                            variant={"solid"}
                            onClick={() => props.onDesignClick()}
                          >
                            designer
                          </MenuItem>;
                        }
                        return (
                          <MenuItem
                            mx={"5px"}
                            key={"header-button-" + index}
                            onClick={() => props.onRoleClick(role)}
                          >
                            {role}
                          </MenuItem>
                        );
                      })}{" "}
                    </MenuList>
                  </Menu>
                </Box>
                <Box display={{ base: "none", md: "block" }}>
                  {props.roles.map((role, index) => {
                    if (role === "manager") {
                      return (
                        <Button
                          key={"header-button-" + index}
                          leftIcon={<ViewIcon />}
                          mx={"5px"}
                          colorScheme={"blue"}
                          variant={"solid"}
                          onClick={() => props.onManagerClick()}
                        >
                          manager
                        </Button>
                      );
                    } else if (role === "designer") {
                      return (
                        <Button
                          key={"header-button-" + index}
                          leftIcon={<FaPencilRuler />}
                          onClick={props.onDesignClick}
                        >
                          Designer
                        </Button>
                      );
                    }
                    return (
                      <Button
                        mx={"5px"}
                        key={"header-button-" + index}
                        onClick={() => props.onRoleClick(role)}
                      >
                        {role}
                      </Button>
                    );
                  })}{" "}
                </Box>
              </Box>

              <Spacer />

              <Flex>
                <Tag
                  size={"lg"}
                  key={"lg"}
                  variant={"subtle"}
                  colorScheme={"cyan"}
                  m={"5px"}
                >
                  <TagLabel>{props.myRole}</TagLabel>
                </Tag>
                <Flex wrap={"wrap"} mx={"10px"}>
                  <IconButton
                    size={"sm"}
                    my={"5px"}
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
                    my={"5px"}
                    size={"sm"}
                    aria-label={"Search database"}
                    onClick={props.onLoggingOpen}
                    icon={<RiFileListLine />}
                  ></IconButton>
                  <IconButton
                    aria-label={"Focus"}
                    icon={<Icon as={RiMusicLine} />}
                    ml={"10px"}
                    my={"5px"}
                    size={"sm"}
                    onClick={() => {
                      props.app.pingAll();
                    }}
                  />
                  <TestInteractionModal app={props.app} />
                </Flex>
              </Flex>
            </Flex>
          </Box>
        </DrawerContent>
      </Drawer>
    </>
  );
};
