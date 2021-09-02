import {
  AddIcon,
  ChevronDownIcon,
  MoonIcon,
  SunIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
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
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { RiFileListLine, RiMusicLine } from "react-icons/ri";
import { FaPencilRuler } from "react-icons/fa";
import { CrossDeviceApplication } from "../shared-application/CrossDeviceApplication";
import { CrossAppState, CrossAppContext } from "../context/AppContext";
import { QRReaderModal } from "./QRReaderModal";
import { IoPushOutline } from "react-icons/io5";

interface HeaderProps {
  app: CrossDeviceApplication;
  roles: string[];
  myRole: string;
  onRoleClick: (role: string) => void;
  onLoggingOpen: () => void;
}

export function Header(props: HeaderProps) {
  const { isSelectMode, setSelectMode } =
    useContext<CrossAppState>(CrossAppContext);
  const { colorMode, toggleColorMode } = useColorMode();
  //const btnRef = React.useRef();

  return (
    <Flex bg={"#272B35"} h={"60px"} py={"10px"} px={"20px"} w={"100%"}>
      <Box>
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
                      onClick={() => {
                        props.onRoleClick("manager");
                      }}
                    >
                      manager
                    </MenuItem>
                  );
                } else if (role === "designer") {
                  <MenuItem
                    key={"header-button-" + index}
                    mx={"5px"}
                    variant={"solid"}
                    onClick={() => {
                      props.onRoleClick("designer");
                    }}
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
                  ml={"5px"}
                  colorScheme={"blue"}
                  variant={"solid"}
                  onClick={() => {
                    props.onRoleClick("manager");
                  }}
                >
                  manager
                </Button>
              );
            } else if (role === "designer") {
              return (
                <Button
                  key={"header-button-" + index}
                  ml={"5px"}
                  colorScheme={"green"}
                  leftIcon={<FaPencilRuler />}
                  onClick={() => {
                    props.onRoleClick("designer");
                  }}
                >
                  designer
                </Button>
              );
            }
            return (
              <Button
                ml={"5px"}
                key={"header-button-" + index}
                onClick={() => props.onRoleClick(role)}
              >
                {role}
              </Button>
            );
          })}
          <Button
            ml={"5px"}
            key={"header-button-add"}
            onClick={() => props.app.getSharedObject().addRole("new")}
          >
            <AddIcon />
          </Button>
        </Box>
      </Box>
      <Spacer />
      <Flex>
        <Tag
          size={"lg"}
          key={"lg"}
          display={{ base: "none", md: "flex" }}
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
              toggleColorMode();
            }}
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          />
          <IconButton
            ml={"10px"}
            my={"5px"}
            size={"sm"}
            aria-label={"Search database"}
            onClick={props.onLoggingOpen}
            icon={<RiFileListLine />}
          />
          <IconButton
            aria-label={"Focus"}
            icon={<Icon as={RiMusicLine} />}
            ml={"10px"}
            my={"5px"}
            size={"sm"}
            onClick={() => {
              props.app.getSharedObject().pingAll();
            }}
          />
          <IconButton
            aria-label={"Focus"}
            icon={<Icon as={IoPushOutline} />}
            ml={"10px"}
            my={"5px"}
            size={"sm"}
            colorScheme={isSelectMode ? undefined : "blue"}
            onClick={() => {
              setSelectMode(!isSelectMode);
            }}
          />
          <QRReaderModal />
        </Flex>
      </Flex>
    </Flex>
  );
}

/* <>
      <IconButton
        ref={btnRef}
        boxShadow={"xl"}
        aria-label={"Open header"}
        onClick={() => {
          setHeaderOpen(true);
        }}
        icon={<ChevronDownIcon />}
      />
      <Drawer
        isOpen={isHeaderOpen}
        placement={"top"}
        onClose={() => {
          setHeaderOpen(false);
        }}
        finalFocusRef={btnRef}
      >
        <DrawerContent>
      */
