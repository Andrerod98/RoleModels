/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-case-declarations */
/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/no-empty-interface */
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
  Spacer,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BoxUI } from "../../../prototyping-tool/shared-object/components/Box";
import { CenterUI } from "../../../prototyping-tool/shared-object/components/Center";
import { CheckboxUI } from "../../../prototyping-tool/shared-object/components/CheckBox";
import { EditableUI } from "../../../prototyping-tool/shared-object/components/Editable";
import { FlexUI } from "../../../prototyping-tool/shared-object/components/Flex";
import { GridUI } from "../../../prototyping-tool/shared-object/components/Grid";
import { ImageUI } from "../../../prototyping-tool/shared-object/components/Image";
import { InputUI } from "../../../prototyping-tool/shared-object/components/Input";
import { LinkUI } from "../../../prototyping-tool/shared-object/components/Link";
import { ListUI } from "../../../prototyping-tool/shared-object/components/List";
import { MapUI } from "../../../prototyping-tool/shared-object/components/Map";
import { RadioUI } from "../../../prototyping-tool/shared-object/components/Radio";
import { SpacerUI } from "../../../prototyping-tool/shared-object/components/Spacer";
import { StackUI } from "../../../prototyping-tool/shared-object/components/Stack";
import { IUIComponent } from "../../../prototyping-tool/shared-object/components/UIComponent";
import { IView } from "../../../prototyping-tool/shared-object/views/IView";
import { View } from "../../../prototyping-tool/shared-object/views/View";

import { ITemplate, Project } from "../../Project";
import { Utils } from "../../Utils";
import { SingleTabCatalogBar } from "./CatalogBar";
import { CodeEditor } from "./CodeEditor";
import { Previewer } from "./Previewer/Previewer";
interface SingleTabProps {
  project: Project;
  template: ITemplate;
  onChange: (value: string) => void;
}

export const SingleTab = (props: SingleTabProps) => {
  const [curTab, setCurTab] = useState("individual");
  const [value, setValue] = useState(
    props.project.viewsToString(
      props.project
        .getLayoutManager(curTab)
        .getViews()
        .map((v) => v.toView())
    )
  );

  const [cursorPosition, setCursorPosition] = useState({ row: 0, column: 0 });
  const [alert, setAlert] = useState(false);
  const tabs = Array.from(props.project.getRoles());
  const views = props.project.getLayoutManager(curTab).getViews();

  const preview = (newValue?: string) => {
    //props.project.stringToViews(value)
    props.project
      .getLayoutManager(curTab)
      .setViews(Utils.stringToJson(newValue === undefined ? value : newValue));
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
        if (Utils.jsonToString(json) === "{}") {
          json = [Examples.getView()];
        } else {
          json = [...json, Examples.getView()];
        }
        //
        setValue(Utils.jsonToString(json));
        preview(Utils.jsonToString(json));
        return;
      case "image":
        object = Examples.getImage();
        break;
      case "spacer":
        object = Examples.getSpacer();
        break;
      case "input":
        object = Examples.getInput();
        break;
      case "list":
        object = Examples.getList();
        break;
      case "link":
        object = Examples.getLink();
        break;
      case "label":
        object = Examples.getText();
        break;
      case "map":
        object = Examples.getMap();
        break;
      case "radio":
        object = Examples.getRadio();
        break;
      case "ink":
        object = Examples.getInk();
        break;
      case "stack":
        object = Examples.getStack();
        break;
      case "editable":
        object = Examples.getEditable();
        break;
      case "slider":
        object = Examples.getSlider();
        break;
      case "flex":
        object = Examples.getFlex();
        break;
      case "center":
        object = Examples.getCenter();
        break;
      case "checkbox":
        object = Examples.getCheckbox();
        break;
      case "box":
        object = Examples.getBox();
        break;
      case "grid":
        object = Examples.getGrid();
        break;

      default:
        object = Examples.getBasic();
        break;
    }

    addUIComponentToEditor(Utils.jsonToString(object));
  };

  const addUIComponentToEditor = (str: string) => {
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
    setCursorPosition(value.cursor);
  };

  const handleChange = (value: any, event?: any) => {
    setValue(value);
    setCursorPosition(event.end);
    props.onChange(value);
  };

  const handleChangeView = (newView: View) => {
    props.project.getLayoutManager(curTab).changeView(newView);
    setValue(
      Utils.jsonToString(
        props.project
          .getLayoutManager(curTab)
          .getViews()
          .map((v) => v.toView())
      )
    );
  };

  const handleChangeViews = (newViews: View[]) => {
    props.project
      .getLayoutManager(curTab)
      .setViews(newViews.map((v) => v.toView()));
    setValue(
      Utils.jsonToString(
        props.project
          .getLayoutManager(curTab)
          .getViews()
          .map((v) => v.toView())
      )
    );
  };

  /*const refresh = ()=>{
    props.project.getLayoutManager().setLayout(value);
  }*/

  /* useEffect(() => {
    console.log(props.template);
    if (props.project.viewsToString(props.template.views) !== value) {
      setValue(props.project.viewsToString(props.template.views));
    }
  }, [props.template]);*/

  const loadRole = (role: string) => {
    setCurTab(role);

    //Load role
    setValue(
      Utils.jsonToString(
        props.project
          .getLayoutManager(role)
          .getViews()
          .map((v) => v.toView())
      )
    );

    setCursorPosition({ row: 0, column: 0 });
    setAlert(false);
  };
  const handleTabClick = (role: string) => {
    loadRole(role);
  };

  const handleTabClose = (role: string) => {
    props.project.removeRole(role);
    loadRole("individual");
  };

  const handleTabChange = (role: string, nextValue: string) => {
    props.project.renameRole(role, nextValue);
    loadRole(nextValue);
  };

  const curIndex = tabs.indexOf(curTab);
  return (
    <Tabs
      size={"sm"}
      variant={"enclosed"}
      h={"100%"}
      index={curIndex === -1 ? 0 : curIndex}
    >
      <Box h={"100%"} overflow={"hidden"}>
        <SingleTabCatalogBar onClick={(element) => addUIComponent(element)} />
        <Box>
          <TabList pl={5}>
            {tabs.map((tab, index) => (
              <CustomTab
                key={"tab-" + index}
                title={tab}
                onClick={() => {
                  handleTabClick(tab);
                }}
                onClose={() => {
                  handleTabClose(tab);
                }}
                onChange={(nextValue) => {
                  handleTabChange(tab, nextValue);
                }}
              />
            ))}

            <Tab
              bg={"blackAlpha.100"}
              onClick={() => {
                props.project.addRole("new");
              }}
            >
              Add...
            </Tab>
          </TabList>
        </Box>
        <TabPanels h={"100%"}>
          {tabs.map((tab, index) => (
            <TabPanel key={"tab-panel-" + index} p={0} h={"100%"}>
              <Flex h={"100%"}>
                <Box boxShadow={"xs"} mr={"10px"}>
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
                  <CodeEditor
                    title={"UI"}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                  />
                </Box>

                <Box flex={"1"} overflow={"auto"}>
                  <Center>
                    <Previewer
                      onChangeView={handleChangeView}
                      onChangeViews={handleChangeViews}
                      views={views}
                      handleClick={() => preview()}
                      project={props.project}
                    />
                    {}
                  </Center>
                </Box>
              </Flex>
            </TabPanel>
          ))}
        </TabPanels>
      </Box>
    </Tabs>
  );
};

class Examples {
  static getView(): IView {
    return {
      id: "view-id",
      root: {
        id: "",
        name: "",
      },
      rows: 1,
      cols: 1,
      combinedViewID: "",
    };
  }
  static getImage(): ImageUI {
    return {
      id: "image-id",
      name: "image",
      width: "100%",
      height: "100%",
      src: "https://singularityhub.com/wp-content/uploads/2018/10/shutterstock_672433252-1068x601.jpg",
    } as ImageUI;
  }
  static getInput(): InputUI {
    return {
      id: "input-id",
      name: "Input",
      //width: "200px",
      //height: "20px",
      value: "Default text...",
    } as InputUI;
  }
  static getLink(): LinkUI {
    return {
      id: "link",
      name: "a",
      width: 460,
      height: 300,
      value: "Link",
      href: "",
    } as LinkUI;
  }
  static getList(): ListUI {
    return {
      id: "list-id",
      name: "list",
      width: "100%",
      height: "100%",
      items: ["one", "two", "three"],
    } as ListUI;
  }
  static getMap(): MapUI {
    return {
      id: "map1",
      name: "map",
      width: "100%",
      height: "100%",
      type: "satelite",
      value: "",
      style: {},
      center: { lat: 59.95, lng: 30.33 },
      zoom: 11,
    } as MapUI;
  }
  static getRadio(): RadioUI {
    return {
      id: "gender_controller",
      name: "radio",
      width: 100,
      height: 40,
      type: "radio",
      label: "Mr.",
      value: "Mr.",
      values: ["Mr.", "Mrs."],
    } as RadioUI;
  }
  static getBasic(): IUIComponent {
    return {
      id: "button-id",
      name: "Button",
      //width: "100px",
      //height: "30px",
      value: "Button",
    };
  }

  static getText(): IUIComponent {
    return {
      id: "text-id",
      name: "Text",
      //width: "100px",
      //height: "30px",
      value: "Label",
    };
  }

  static getInk(): IUIComponent {
    return {
      id: "ink",
      name: "ink",
      //width: 460,
      //height: 300,
      value: "Ink",
    };
  }

  static getFlex(): FlexUI {
    return {
      id: "flex-id",
      name: "flex",
      h: "100%",
      w: "100%",
      align: "center",
      children: [],
    };
  }

  static getBox(): BoxUI {
    return {
      id: "box-id",
      name: "box",

      //type: "text",
      //align: "center",
      children: [],
    };
  }

  static getCenter(): CenterUI {
    return {
      id: "center-id",
      name: "center",
      children: [],
    };
  }

  static getGrid(): GridUI {
    return {
      id: "grid-id",
      name: "center",
      children: [],
    };
  }

  static getStack(): StackUI {
    return {
      id: "stack-id",
      name: "center",
      children: [],
    };
  }

  static getCheckbox(): CheckboxUI {
    return {
      id: "checkbox-id",
      name: "checkbox",
      children: [],
    };
  }

  static getEditable(): EditableUI {
    return {
      id: "editable-id",
      name: "editable",
      children: [],
    };
  }

  static getSlider(): EditableUI {
    return {
      id: "slider-id",
      name: "slider",
      children: [],
    };
  }

  static getSpacer(): SpacerUI {
    return {
      id: "spacer",
      name: "spacer",
    };
  }
}

const CustomTab = (props: any) => {
  // 2. Reuse the `useTab` hook
  const tabProps = useTab(props);
  const isSelected = !!tabProps["aria-selected"];

  // 3. Hook into the Tabs `size`, `variant`, props

  const [isOver, setOver] = useState(false);

  return (
    <Tab {...tabProps}>
      <Box
        onMouseOver={() => {
          setOver(true);
        }}
        onMouseLeave={() => {
          setOver(false);
        }}
      >
        <Flex m={"2px"}>
          {isSelected ? (
            <Editable
              onClick={(e) => {
                e.stopPropagation();
                props.onClick();
              }}
              onSubmit={(nextValue) => {
                props.onChange(nextValue);
              }}
              defaultValue={tabProps.title as string}
            >
              <EditablePreview />
              <EditableInput />
            </Editable>
          ) : (
            tabProps.title
          )}
          <Spacer></Spacer>
          {isOver ? (
            <CloseButton
              size={"sm"}
              onClick={(e) => {
                e.stopPropagation();
                props.onClose();
              }}
            ></CloseButton>
          ) : (
            <Box w={"24px"}></Box>
          )}
        </Flex>
      </Box>
    </Tab>
  );
};
