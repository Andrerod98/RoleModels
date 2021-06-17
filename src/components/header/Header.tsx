import { ChevronDownIcon, ViewIcon } from "@chakra-ui/icons";
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
  useDisclosure,
} from "@chakra-ui/react";
import React, { FC } from "react";
import { CrossDeviceApplication } from "../../CrossDeviceApplication";
import { RiMusicLine } from "react-icons/ri";
import { FaPencilRuler } from "react-icons/fa";
import { TestInteractionModal } from "./InteractionModal";

interface HeaderProps {
  roles: string[];
  myRole: string;
  onRoleClick: (role: string) => void;
  onManagerClick: () => void;
  onDesignClick: () => void;
  app: CrossDeviceApplication;
}

export const Header: FC<HeaderProps> = (props: HeaderProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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

              <Box>
                <Tag
                  size={"lg"}
                  key={"lg"}
                  variant={"subtle"}
                  colorScheme={"cyan"}
                  m={"5px"}
                >
                  <TagLabel>{props.myRole}</TagLabel>
                </Tag>
                <IconButton
                  aria-label={"Focus"}
                  icon={<Icon as={RiMusicLine} />}
                  mx={"5px"}
                  onClick={() => {
                    props.app.pingAll();
                  }}
                />
                <TestInteractionModal app={props.app} />
              </Box>
            </Flex>
          </Box>
        </DrawerContent>
      </Drawer>
    </>
  );
};
