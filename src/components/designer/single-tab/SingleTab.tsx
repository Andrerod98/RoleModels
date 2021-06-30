/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-case-declarations */
/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { AddIcon } from "@chakra-ui/icons";
import {
  Flex,
  Box,
  Center,
  Alert,
  AlertDescription,
  AlertIcon,
  CloseButton,
  TabPanel,
  Tabs,
  TabPanels,
  TabList,
  Tab,
  Editable,
  EditableInput,
  EditablePreview,
  useTab,
  useDisclosure,
  Heading,
  VStack,
  Button,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { CrossDeviceApplication } from "../../../CrossDeviceApplication";
import { Role } from "../../../shared-object/roles/Role";
import { View } from "../../../shared-object/views/View";
import Utils from "../../../utils/Utils";
import { LayoutModal } from "../../header/LayoutModal";
import { ComponentsExamples } from "../ComponentsExamples";

import { SingleTabCatalogBar } from "./CatalogBar";
import { CodeEditor } from "./CodeEditor";
import { Previewer } from "./Previewer/Previewer";
interface SingleTabProps {
  app: CrossDeviceApplication;
}

export const SingleTab = (props: SingleTabProps) => {
  const [curTab, setCurTab] = useState("default");

  const tabs = Array.from(props.app.getSharedObject().getRoles());

  const curIndex = tabs.findIndex((tab) => tab.getName() === curTab);

  /*const refresh = ()=>{
    props.project.getLayoutManager().setLayout(value);
  }*/

  const loadRole = (role: string) => {
    console.log("role " + role + " loading");
    setCurTab(role);

    const r = props.app.getRole(curTab);

    if (r === undefined) {
      console.warn("The layout manager of " + role + " was not found.");
      console.table(Array.from(props.app.getSharedObject().getRoles()));
      return;
    }

    //Load role
    /* setValue(
      Utils.jsonToString(
        props.app
          .getRole(curTab)
          .getViews()
          .map((v) => v.toView())
      )
    );

    setCursorPosition({ row: 0, column: 0 });
    setAlert(false);*/
  };
  const handleTabClick = (role: string) => {
    console.log("Tab click");
    loadRole(role);
  };

  const handleTabClose = (role: string) => {
    console.log("Tab close");
    props.app.getSharedObject().removeRole(role);
    loadRole("default");
  };

  const handleTabSubmit = async (role: string, e: any) => {
    console.log("Tab is changing");
    const nextValue = e;
    if (nextValue === "") {
      return;
    }

    await props.app.getSharedObject().renameRole(role, nextValue);
    loadRole(nextValue);
  };

  console.log("render");

  return (
    <Box h={"100%"} overflow={"hidden"}>
      <Tabs
        size={"sm"}
        variant={"enclosed"}
        h={"100%"}
        mt={"5px"}
        isManual
        onChange={() => {
          console.log("Changed");
        }}
        index={
          curIndex === -1
            ? curTab === "interactions"
              ? tabs.length + 1
              : 0
            : curIndex
        }
      >
        <Box>
          <TabList pl={10}>
            {tabs.map((tab, index) => (
              <CustomTab
                key={"tab-" + index}
                title={tab.getName()}
                onClick={() => {
                  handleTabClick(tab.getName());
                }}
                onClose={() => {
                  handleTabClose(tab.getName());
                }}
                onSubmit={(e) => {
                  handleTabSubmit(tab.getName(), e);
                }}
              />
            ))}

            <Tab
              ml={"5px"}
              bg={"transparent"}
              _hover={{ bg: "blackAlpha.100" }}
              onClick={() => {
                props.app.addRole("new");
              }}
            >
              <AddIcon />
            </Tab>
            <Tab
              ml={"5px"}
              colorScheme={"blue"}
              _hover={{ bg: "blackAlpha.100" }}
              onClick={() => {
                setCurTab("interactions");
              }}
            >
              Interactions
            </Tab>
          </TabList>
        </Box>
        <TabPanels h={"calc(100vh - 40px)"}>
          {tabs.map((tab, index) => (
            <TabPanel key={"tab-panel-" + index} p={0} h={"100%"}>
              <MemoizedRole role={tab} app={props.app} />
            </TabPanel>
          ))}
          <TabPanel key={"tab-panel-add"} p={0} h={"100%"}></TabPanel>
          <TabPanel key={"tab-panel-interactions"} p={0} h={"100%"}>
            <InteractionsTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export const MemoizedRole = React.memo(RoleTab);

const CustomTab = (props: any) => {
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
              onKeyDown={(e: any) => {
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
};

export function InteractionsTab() {
  return (
    <Box h={"100%"} bg={"gray.100"}>
      <Flex h={"100%"} bg={"gray.100"}>
        <Box h={"100%"} py={3} width={"70%"} bg={"gray.100"} mb={"20px"}>
          <Heading
            as={"h5"}
            px={5}
            fontSize={"12px"}
            textAlign={"left"}
            mb={"5px"}
          >
            INTERACTIONS
          </Heading>
          <CodeEditor
            title={"Interactions"}
            value={""}
            onChange={() => {}}
            onFocus={() => {}}
          />
        </Box>
        <Box h={"100%"} py={3} width={"30%"} bg={"gray.100"} mb={"20px"}>
          <Heading
            as={"h5"}
            px={5}
            fontSize={"12px"}
            textAlign={"left"}
            mb={"5px"}
          >
            AVAILABLE COMMANDS
          </Heading>
          <Button>Load</Button>
          <VStack></VStack>
        </Box>
      </Flex>
    </Box>
  );
}

interface RoleTabProps {
  role: Role;
  app: CrossDeviceApplication;
}

export function RoleTab(props: RoleTabProps) {
  const views = props.role.getViews();
  const [value, setValue] = useState(
    Utils.jsonToString(views.map((v) => v.toView()))
  );
  const [cursorPosition, setCursorPosition] = useState({ row: 0, column: 0 });
  const [alert, setAlert] = useState(false);
  const [newViewId, setNewViewId] = useState("");
  const [selectedNode, setSelectedNode] = useState("");

  const layout = props.app
    .getSharedObject()
    .getCurrentConfigurationOfRole(props.role.getName());

  const { isOpen, onClose, onOpen } = useDisclosure();

  console.log("RENDERED");

  const preview = (newValue?: string, nvid?: string) => {
    console.log("Preview");
    //props.project.stringToViews(value)

    props.role.updateIViews(
      Utils.stringToJson(newValue === undefined ? value : newValue)
    );
    setValue(newValue === undefined ? value : newValue);
  };

  const addUIComponent = (name: string) => {
    setAlert(false);
    let object;
    let json = Utils.stringToJson(value);
    if (json === undefined) {
      setAlert(true);
      return;
    }
    switch (name) {
      case "view":
        console.log(json);
        const newView = ComponentsExamples.getView();
        if (Utils.jsonToString(json) === "{}") {
          json = [newView];
        } else {
          json = [...json, newView];
        }
        //Open layout modal

        setValue(Utils.jsonToString(json));
        preview(Utils.jsonToString(json));
        setNewViewId(newView.id);
        onOpen();

        return;
      case "image":
        object = ComponentsExamples.getImage();
        break;
      case "spacer":
        object = ComponentsExamples.getSpacer();
        break;
      case "input":
        object = ComponentsExamples.getInput();
        break;
      case "list":
        object = ComponentsExamples.getList();
        break;
      case "link":
        object = ComponentsExamples.getLink();
        break;
      case "label":
        object = ComponentsExamples.getText();
        break;
      case "map":
        object = ComponentsExamples.getMap();
        break;
      case "radio":
        object = ComponentsExamples.getRadio();
        break;
      case "ink":
        object = ComponentsExamples.getInk();
        break;
      case "stack":
        object = ComponentsExamples.getStack();
        break;
      case "editable":
        object = ComponentsExamples.getEditable();
        break;
      case "slider":
        object = ComponentsExamples.getSlider();
        break;
      case "flex":
        object = ComponentsExamples.getFlex();
        break;
      case "center":
        object = ComponentsExamples.getCenter();
        break;
      case "checkbox":
        object = ComponentsExamples.getCheckbox();
        break;
      case "box":
        object = ComponentsExamples.getBox();
        break;
      case "grid":
        object = ComponentsExamples.getGrid();
        break;

      default:
        object = ComponentsExamples.getBasic();
        break;
    }

    addUIComponentToEditor(Utils.jsonToString(object));
  };

  const addUIComponentToEditor = (str: string) => {
    console.log("add ui component");
    const oldValue = value;
    const rows = oldValue.split("\n");
    const row = cursorPosition.row;
    const column = cursorPosition.column;
    const line = rows[row];
    let previous = line.substring(0, column);
    previous = previous.trim();
    if (previous.endsWith("}")) previous += ",";

    console.log(previous);
    rows[row] = previous + str + line.substring(column);
    const newValue = rows.join("\n");

    const newFormattedValue = Utils.stringToJson(newValue);
    if (newFormattedValue === undefined) {
      setAlert(true);
    } else {
      setValue(Utils.jsonToString(newFormattedValue));

      preview(Utils.jsonToString(newFormattedValue));
    }

    // console.log(cursorStart);
    // this.setState({ value: newValue });
  };

  const handleFocus = (value: any) => {
    console.log("handle focus");
    setCursorPosition(value.cursor);
  };

  const handleChange = (value: any, event?: any) => {
    console.log("handle change");
    setValue(value);
    setCursorPosition(event.end);
  };

  const handleChangeView = (newView: View) => {
    console.log("view change");
    props.role.updateView(newView);
    setValue(Utils.jsonToString(props.role.getViews().map((v) => v.toView())));
  };

  const handleChangeViews = (newViews: View[]) => {
    console.log("change views");

    props.role.updateViews(newViews);

    setValue(Utils.jsonToString(props.role.getViews().map((v) => v.toView())));
  };
  return (
    <Box h={"100%"} bg={"gray.100"}>
      <Flex h={"100%"} bg={"gray.100"}>
        <SingleTabCatalogBar onClick={(element) => addUIComponent(element)} />

        <Box flex={"1"} py={3} overflow={"hidden"} bg={"gray.100"} mb={"30px"}>
          <Heading
            as={"h5"}
            px={5}
            fontSize={"12px"}
            textAlign={"left"}
            mb={"5px"}
          >
            PREVIEW
          </Heading>
          <Center h={"100%"} bg={"gray.700"} w={"100%"}>
            <Previewer
              onChangeView={handleChangeView}
              onChangeViews={handleChangeViews}
              layout={layout}
              role={props.role}
              app={props.app}
              isOpenLayoutModal={isOpen}
              handleClick={() => {
                preview();
              }}
              setSelected={(newSelected: string) => {
                console.log("SETTING SELECTED NODE");
                setSelectedNode(newSelected);
              }}
              selectedNode={selectedNode}
            />
            {}
          </Center>
        </Box>
        <Box>
          {alert ? (
            <Alert status={"error"}>
              <AlertIcon />
              <AlertDescription>
                The Json is incorrect fix it to add new components
              </AlertDescription>
              <CloseButton
                position={"absolute"}
                right={"8px"}
                top={"8px"}
                onClick={() => {
                  setAlert(false);
                }}
              />
            </Alert>
          ) : (
            <></>
          )}
          <Box h={"100%"} py={3} width={"400px"} bg={"gray.100"} mb={"20px"}>
            <Heading
              as={"h5"}
              px={5}
              fontSize={"12px"}
              textAlign={"left"}
              mb={"5px"}
            >
              SOURCE
            </Heading>
            <CodeEditor
              title={"UI"}
              value={value}
              onChange={handleChange}
              onFocus={handleFocus}
            />
          </Box>
        </Box>
      </Flex>
      <LayoutModal
        layout={layout}
        newViewId={newViewId}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        setSelected={(newSelected: string) => {
          console.log("SELECTED NEW");
          setSelectedNode(newSelected);
        }}
        selectedNode={selectedNode}
      />
    </Box>
  );
}
