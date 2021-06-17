import * as React from "react";
import { UIComponentController } from "./UIComponentController";

interface UIComponentProps {
  controller: UIComponentController;
}

export class UIComponentView extends React.Component<UIComponentProps, {}> {
  /*
  protected componentRef = createRef();


  public getComponent() {
    return this.props.component;
  }

  public getCombinedViewManager() {
    return this.props.cvm;
  }

  public getComponentRef() {
    return this.componentRef;
  }

  protected get x() {
    if (this.props.cvm instanceof StitchingCombinedViewManager) {
      if (this.props.cvm.getRole() == "viewer") {
        return this.props.component.x - 460;
      } else {
        return this.props.component.x;
      }
    }
    return this.props.component.x;
  }

  public addEventListener(
    type: keyof HTMLElementEventMap,
    listener: (this: HTMLElement, ev: any) => any,
    options?: boolean | AddEventListenerOptions
  ): void {
    const htmlElement = document.getElementById(this.props.component.id);

    if (htmlElement === null) {
      console.error(
        "Could not add event listener because HTML Element was not found."
      );
      return;
    }

    htmlElement.removeEventListener(type, listener, options);
    htmlElement.addEventListener(type, listener, options);
  }

  public removeEventListeners() {
    const htmlElement = document.getElementById(this.props.component.id);

    if (htmlElement === null) {
      console.error(
        "Could not remove event listeners because HTML Element was not found."
      );
      return;
    }
    htmlElement.replaceWith(htmlElement.cloneNode(true));
  }
*/

  render() {
    const controller = this.props.controller;
    return React.createElement(
      controller.get().name,

      {
        className: "remove-all-styles",
        // ref: this.componentRef,
        id: controller.get().id,
        key: controller.get().id,
        style: {
          ...controller.get().style,
          /* position: "absolute",
          top: controller.getY() + "px",
          left: controller.getX() + "px",
          width: controller.get().width + "px",
          height: controller.get().height + "px",
          backgroundColor: controller.get().style
            ?.backgroundColor,
          border: this.props.controller.get().style?.border,
          color: controller.get().style?.color,*/
        },
        ...controller.getListeners(),
      },

      controller.get().value
    );
  }
}
