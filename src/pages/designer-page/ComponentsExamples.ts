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
  SliderUI,
  InkCanvasUI,
} from "../../shared-components";
import { QRCodeUI } from "../../shared-components/QRCode";
import { IContainer } from "../../shared-application/containers/IContainer";

export class ComponentsExamples {
  static getView(): IContainer {
    return {
      id: uuid(),
      root: {
        id: "box-id",
        name: "box",
        w: "100%",
        h: "100%",
        children: [],
      } as IUIComponent,
    };
  }
  static getImage(): ImageUI {
    return {
      id: "image-id",
      name: "image",
      width: "100px",
      height: "100px",
      src: "https://singularityhub.com/wp-content/uploads/2018/10/shutterstock_672433252-1068x601.jpg",
    } as ImageUI;
  }
  static getInput(): InputUI {
    return {
      id: "input-id",
      name: "input",
      label: "Default label",
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
      width: "100px",
      height: "100px",
      items: ["one", "two", "three"],
    } as ListUI;
  }
  static getMap(): MapUI {
    return {
      id: "map-id",
      name: "map",
      width: "100%",
      height: "100%",
      type: "satelite",
      center: { lat: 59.95, lng: 30.33 },
      zoom: 11,
    } as MapUI;
  }
  static getRadio(): RadioUI {
    return {
      id: "radio-id",
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
      name: "button",
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

  static getInk(): InkCanvasUI {
    return {
      id: "ink-id",
      name: "ink",
      color: { r: 0, g: 255, b: 255, a: 1 },
      thickness: 1,
    };
  }

  static getFlex(): FlexUI {
    return {
      id: "flex-id",
      name: "flex",
      h: "100%",
      w: "100%",
      children: [],
    };
  }

  static getBox(): BoxUI {
    return {
      id: "box-id",
      name: "box",
      h: "100%",
      w: "100%",
      children: [],
    };
  }

  static getCenter(): CenterUI {
    return {
      id: "center-id",
      name: "center",
      h: "100%",
      w: "100%",
      children: [],
    };
  }

  static getGrid(): GridUI {
    return {
      id: "grid-id",
      name: "grid",
      h: "100%",
      w: "100%",
      children: [],
    };
  }

  static getStack(): StackUI {
    return {
      id: "stack-id",
      name: "stack",
      h: "100%",
      w: "100%",
      children: [],
    };
  }

  static getCheckbox(): CheckboxUI {
    return {
      id: "checkbox-id",
      name: "checkbox",
    };
  }

  static getEditable(): EditableUI {
    return {
      id: "editable-id",
      name: "editable",
    };
  }

  static getSlider(): SliderUI {
    return {
      id: "slider-id",
      name: "slider",
    };
  }

  static getSpacer(): SpacerUI {
    return {
      id: "spacer",
      name: "spacer",
    };
  }

  static getQRCode(): QRCodeUI {
    return {
      id: "qr-id",
      name: "qrcode",
      value: "",
      nScanned: 0,
    };
  }
}
