import { ChevronDownIcon, MoonIcon, SunIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Spacer,
  useColorMode,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { RiFileListLine } from "react-icons/ri";
import { FaPencilRuler } from "react-icons/fa";
import { CrossAppState, CrossAppContext } from "../context/AppContext";
import { QRReaderModal } from "./QRReaderModal";
import { IoPushOutline } from "react-icons/io5";
import { MdContentCopy } from "react-icons/md";
import { BiSave } from "react-icons/bi";
import { GrPowerReset } from "react-icons/gr";
import { AiOutlineHome } from "react-icons/ai";
import { Mode } from "../context/Modes";

interface HeaderProps {
  roles: string[];
  myRole: string;
  onRoleClick: (role: string) => void;
  onLoggingOpen: () => void;
}

export const Header = (props: HeaderProps) => {
  const {
    app,
    roleModels,
    localMode,
    setLocalMode,
    mode,
    setOpen,
    isOpen,
    role,
  } = useContext<CrossAppState>(CrossAppContext);

  const { colorMode, toggleColorMode } = useColorMode();
  //const btnRef = React.useRef();

  return (
    <Box>
      <Flex bg={"#272B35"} w={"100%"} p={"10px"}>
        <Box>
          <Box display={{ base: "block", md: "none" }}>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                {props.myRole}
              </MenuButton>
              <MenuList>
                {props.roles.map((curRole, index) => {
                  if (curRole === "manager") {
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
                  } else if (curRole === "designer") {
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
                      onClick={() => props.onRoleClick(curRole)}
                    >
                      {curRole}
                    </MenuItem>
                  );
                })}{" "}
              </MenuList>
            </Menu>
          </Box>
          <Box display={{ base: "none", md: "block" }}>
            {props.roles.map((curRole, index) => {
              if (curRole === "manager") {
                return (
                  <Button
                    key={"header-button-" + index}
                    leftIcon={<ViewIcon />}
                    size='md'
                    color={"white"}
                    colorScheme={"blue"}
                    _hover={{ bg: "blue.600", color: "white" }}
                    _focus={{ bg: "blue.600", color: "white" }}
                    ml={"5px"}
                    variant={role.getName() === curRole ? "solid" : "outline"}
                    onClick={() => {
                      props.onRoleClick("manager");
                    }}
                  >
                    manager
                  </Button>
                );
              } else if (curRole === "designer") {
                return (
                  <Button
                    key={"header-button-" + index}
                    ml={"5px"}
                    size='md'
                    color={"white"}
                    colorScheme={"blue"}
                    _hover={{ bg: "blue.600", color: "white" }}
                    _focus={{ bg: "blue.600", color: "white" }}
                    variant={role.getName() === curRole ? "solid" : "outline"}
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
                  size='md'
                  color={"white"}
                  colorScheme={"blue"}
                  _hover={{ bg: "blue.600", color: "white" }}
                  _focus={{ bg: "blue.600", color: "white" }}
                  variant={role.getName() === curRole ? "solid" : "outline"}
                  key={"header-button-" + index}
                  onClick={() => props.onRoleClick(curRole)}
                >
                  {curRole}
                </Button>
              );
            })}
            {/* <Button
              ml={"5px"}
              key={"header-button-add"}
              onClick={() => roleModels.addRole("role" + props.roles.length)}
            >
              <AddIcon />
           </Button> */}
          </Box>
        </Box>
        <Spacer />

        {/*<Tag
          size={"lg"}
          key={"lg"}
          display={{ base: "none", md: "flex" }}
          variant={"subtle"}
          colorScheme={"cyan"}
          m={"5px"}
        >
          <TagLabel>{props.myRole}</TagLabel>
        </Tag>*/}
        <IconButton
          size={"md"}
          aria-label={"Search database"}
          borderRadius={"5px"}
          onClick={() => {
            toggleColorMode();
          }}
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        />
        <IconButton
          ml={"10px"}
          size={"md"}
          borderRadius={"5px"}
          aria-label={"Search database"}
          onClick={props.onLoggingOpen}
          icon={<RiFileListLine />}
        />
        <IconButton
          ml={"10px"}
          size={"md"}
          borderRadius={"5px"}
          aria-label={"Search database"}
          onClick={() => {
            window.location.href = "https://" + app.getServerURL() + ":8080/#";
            window.location.replace(
              "https://" + app.getServerURL() + ":8080/#"
            );
            window.location.reload();
          }}
          icon={<AiOutlineHome />}
        />
        {/*<IconButton
            aria-label={"Focus"}
            icon={<Icon as={RiMusicLine} />}
            ml={"10px"}
            my={"5px"}
            size={"sm"}
            onClick={() => {
              props.app.getSharedObject().pingAll();
            }}
          />*/}
      </Flex>

      <Divider bg={"white"} />

      <Flex
        wrap={"wrap"}
        bg={"#272B35"}
        w={"100%"}
        p={"5px"}
        display={
          role.getName() === "manager" || role.getName() === "designer"
            ? "none"
            : "flex"
        }
        justifyContent={"center"}
      >
        <IconButton
          aria-label={"Focus"}
          icon={<Icon as={BiSave} />}
          ml={"10px"}
          my={"5px"}
          size={"sm"}
          borderRadius={"5px"}
          onClick={() => {
            setOpen({ ...isOpen, saveWorkspaceModal: true });
          }}
        />
        <IconButton
          aria-label={"Focus"}
          icon={<Icon as={GrPowerReset} />}
          ml={"10px"}
          my={"5px"}
          size={"sm"}
          borderRadius={"5px"}
          onClick={() => {
            roleModels.resetWorkspace(role.getId());
          }}
        />
        <Center>
          <Divider
            orientation='vertical'
            bg={"white"}
            h={"60%"}
            ml={"10px"}
            userSelect={"none"}
          />
        </Center>
        <IconButton
          aria-label={"Focus"}
          icon={<Icon as={IoPushOutline} />}
          ml={"10px"}
          my={"5px"}
          size={"sm"}
          color={"white"}
          borderRadius={"5px"}
          borderColor={"gray.600"}
          _hover={{ color: "white", bg: "black" }}
          _focus={{ color: "white" }}
          bg={localMode.mode === Mode.CopyPaste ? "black" : "transparent"}
          onClick={() => {
            if (mode.mode === Mode.CopyPaste) {
              setLocalMode({ mode: Mode.Default });
              roleModels.setMode(Mode.Default);
            } else if (localMode.mode === Mode.CopyPaste) {
              setLocalMode({ mode: Mode.Default });
            } else {
              setLocalMode({ mode: Mode.CopyPaste });
            }
          }}
        />

        <QRReaderModal />
      </Flex>
    </Box>
  );
};
