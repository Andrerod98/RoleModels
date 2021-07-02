import { uuid } from "uuidv4";
import {
  ImageUI,
  InputUI,
  LinkUI,
  ListUI,
  MapUI,
  RadioUI,
  IUIComponent,
  FlexUI,
  BoxUI,
  CenterUI,
  GridUI,
  StackUI,
  CheckboxUI,
  EditableUI,
  SpacerUI,
} from "../../shared-application/components";
import { IView } from "../../shared-application/views/IView";

export class ComponentsExamples {
  static getView(): IView {
    return {
      id: uuid(),
      root: {
        id: "button",
        name: "Button",
        children: [],
      },
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
