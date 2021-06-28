import { Box, Flex } from "@chakra-ui/react";
import EventEmitter from "events";
import React from "react";
import { ViewComponent } from "../../components/view/ViewComponent";
import { ILayoutNode } from "./ILayout";

export class LayoutNode extends EventEmitter {
  parent: LayoutNode;
  children: LayoutNode[];
  name: "view" | "flex" | "div";
  viewId: string;

  constructor(model: ILayoutNode, parent?: LayoutNode) {
    super();
    this.parent = parent;
    this.children = [];
    this.name = model.name;
    this.viewId = model.viewId;

    if (model.children) {
      model.children.forEach((child) => this.addChild(child));
    }
  }

  getViewId() {
    return this.viewId;
  }

  getChildByID(id: string): LayoutNode {
    return this.searchInNode(this, id);
  }

  public searchInNode(
    element: LayoutNode,
    matchingID: string
  ): LayoutNode | null {
    if (element.getSnapshot().viewId == matchingID) {
      return element;
    } else if (element.children != null) {
      let i;
      let result = null;
      for (i = 0; result == null && i < element.children.length; i++) {
        result = this.searchInNode(element.children[i], matchingID);
      }
      return result;
    }
    return null;
  }

  addChild(model: ILayoutNode) {
    this.children.push(new LayoutNode(model, this));
  }

  removeChild(viewId: string) {
    const index = this.children.findIndex((c) => c.getViewId() === viewId);
    this.children.splice(index, 1);
  }

  public removeView(viewId: string) {
    if (this.getViewId() === viewId) {
      this.update({ name: "div", children: [], viewId: "" });
    } else {
      const child = this.getChildByID(viewId);
      if (child) {
        child.parent.removeChild(viewId);
      }
    }
    this.getRoot().emit("change");
  }

  public update(model: ILayoutNode) {
    this.children = [];

    this.viewId = model.viewId;
    this.name = model.name;

    if (model.children) {
      model.children.forEach((child) => this.addChild(child));
    }

    console.log({ text: "Full tree:", mod: this.getRoot().getSnapshot() });

    console.log({ text: "New model:", mod: model });

    this.getRoot().emit("change", this);
  }

  getSnapshot(): ILayoutNode {
    let snapshot = { name: this.name, viewId: this.viewId, children: [] };

    this.children.forEach((child) => {
      snapshot.children.push(child.getSnapshot());
    });

    return snapshot;
  }

  public splitRight(viewId: string) {
    // if the parent is a flex then add view to parent right next to it
    // if the parent is a div then add flex with view

    if (!this.parent) {
      console.log("parent=" + "undefined");
      const newValue = {
        name: "flex",
        viewId: "",
        children: [
          this.toLayout(),
          {
            name: "view",
            viewId: viewId,
          },
        ],
      } as ILayoutNode;
      this.update(newValue);
      // Update parent with new value
    } else {
      console.log("parent=" + this.parent.name);
      if (this.parent!.getSnapshot().name === "div") {
        const newValue = {
          name: "flex",
          viewId: "",
          children: [
            this.toLayout(),
            {
              name: "view",
              viewId: viewId,
            },
          ],
        } as ILayoutNode;
        console.log("Aqui");
        this.update(newValue);
        // Update parent with new value
      } else if (this.parent!.getSnapshot().name === "flex") {
        const children = this.parent.toLayout().children;
        const index = children.findIndex((l) => l.viewId === this.viewId);
        children.splice(index + 1, 0, {
          name: "view",
          viewId: viewId,
        });

        const newValue = {
          ...this.parent.toLayout(),
          children: [...children],
        } as ILayoutNode;
        console.log("Aqui2");
        this.parent.update(newValue);
        // Update parent with new value
      }
    }
  }

  public splitExtremeRight(viewId: string) {
    // if the parent is a flex then add view to parent right next to it
    // if the parent is a div then add flex with view

    if (!this.parent) {
      console.log("parent=" + "undefined");
      const newValue = {
        name: "flex",
        viewId: "",
        children: [
          this.toLayout(),
          {
            name: "view",
            viewId: viewId,
          },
        ],
      } as ILayoutNode;
      this.update(newValue);
      // Update parent with new value
    } else {
      console.log("parent=" + this.parent.name);
      if (this.parent!.getSnapshot().name === "div") {
        const newValue = {
          name: "flex",
          viewId: "",
          children: [
            this.toLayout(),
            {
              name: "view",
              viewId: viewId,
            },
          ],
        } as ILayoutNode;
        console.log("Aqui");
        this.update(newValue);
        // Update parent with new value
      } else if (this.parent!.getSnapshot().name === "flex") {
        const children = this.parent.toLayout().children;

        const newValue = {
          ...this.parent.toLayout(),
          children: [
            ...children,
            {
              name: "view",
              viewId: viewId,
            },
          ],
        } as ILayoutNode;
        console.log("Aqui2");
        this.parent.update(newValue);
        // Update parent with new value
      }
    }
  }

  public splitLeft(viewId: string) {
    // if the parent is a flex then add view to parent right next to it
    // if the parent is a div then add flex with view
    if (!this.parent) {
      console.log("parent=" + "undefined");
      const newValue = {
        name: "flex",
        viewId: "",
        children: [
          {
            name: "view",
            viewId: viewId,
          },
          this.toLayout(),
        ],
      } as ILayoutNode;
      this.update(newValue);
      // Update parent with new value
    } else {
      console.log("parent=" + this.parent.name);
      if (this.parent!.getSnapshot().name === "div") {
        const newValue = {
          name: "flex",
          viewId: "",
          children: [
            {
              name: "view",
              viewId: viewId,
            },
            this.toLayout(),
          ],
        } as ILayoutNode;
        console.log("Aqui");
        this.update(newValue);
        // Update parent with new value
      } else if (this.parent!.getSnapshot().name === "flex") {
        const children = this.parent.toLayout().children;
        const index = children.findIndex((l) => l.viewId === this.viewId);
        children.splice(index, 0, {
          name: "view",
          viewId: viewId,
        });

        const newValue = {
          ...this.parent.toLayout(),
          children: [...children],
        } as ILayoutNode;
        console.log("Aqui2");
        this.parent.update(newValue);
        // Update parent with new value
      }
    }
  }

  public splitExtremeLeft(viewId: string) {
    // if the parent is a flex then add view to parent right next to it
    // if the parent is a div then add flex with view
    if (!this.parent) {
      console.log("parent=" + "undefined");
      const newValue = {
        name: "flex",
        viewId: "",
        children: [
          {
            name: "view",
            viewId: viewId,
          },
          this.toLayout(),
        ],
      } as ILayoutNode;
      this.update(newValue);
      // Update parent with new value
    } else {
      console.log("parent=" + this.parent.name);
      if (this.parent!.getSnapshot().name === "div") {
        const newValue = {
          name: "flex",
          viewId: "",
          children: [
            {
              name: "view",
              viewId: viewId,
            },
            this.toLayout(),
          ],
        } as ILayoutNode;
        console.log("Aqui");
        this.update(newValue);
        // Update parent with new value
      } else if (this.parent!.getSnapshot().name === "flex") {
        const children = this.parent.toLayout().children;

        const newValue = {
          ...this.parent.toLayout(),
          children: [
            {
              name: "view",
              viewId: viewId,
            },
            ...children,
          ],
        } as ILayoutNode;
        console.log("Aqui2");
        this.parent.update(newValue);
        // Update parent with new value
      }
    }
  }

  getRoot(): LayoutNode {
    if (this.parent == null) {
      return this;
    } else {
      return this.parent.getRoot();
    }
  }
  public splitExtremeTop(viewId: string) {
    if (!this.parent) {
      console.log("parent=undefined");
      const newValue = {
        name: "div",
        viewId: "",
        children: [
          {
            name: "view",
            viewId: viewId,
          },
          this.toLayout(),
        ],
      } as ILayoutNode;
      this.update(newValue);
      // Update parent with new value
    } else {
      console.log("parent=" + this.parent.name);
      if (this.parent!.getSnapshot().name === "flex") {
        const newValue = {
          name: "div",
          viewId: "",
          children: [
            {
              name: "view",
              viewId: viewId,
            },
            this.toLayout(),
          ],
        } as ILayoutNode;
        this.update(newValue);
        // Update parent with new value
      } else if (this.parent!.getSnapshot().name === "div") {
        const newValue = {
          ...this.parent.toLayout(),
          children: [
            {
              name: "view",
              viewId: viewId,
            },
            ...this.parent.toLayout().children,
          ],
        } as ILayoutNode;
        this.parent.update(newValue);
        // Update parent with new value
      }
    }
  }
  public splitTop(viewId: string) {
    if (!this.parent) {
      console.log("parent=undefined");
      const newValue = {
        name: "div",
        viewId: "",
        children: [
          {
            name: "view",
            viewId: viewId,
          },
          this.toLayout(),
        ],
      } as ILayoutNode;
      this.update(newValue);
      // Update parent with new value
    } else {
      console.log("parent=" + this.parent.name);
      if (this.parent!.getSnapshot().name === "flex") {
        const newValue = {
          name: "div",
          viewId: "",
          children: [
            {
              name: "view",
              viewId: viewId,
            },
            this.toLayout(),
          ],
        } as ILayoutNode;
        this.update(newValue);
        // Update parent with new value
      } else if (this.parent!.getSnapshot().name === "div") {
        const children = this.parent.toLayout().children;
        const index = children.findIndex((l) => l.viewId === this.viewId);
        children.splice(index, 0, {
          name: "view",
          viewId: viewId,
        });
        const newValue = {
          ...this.parent.toLayout(),
          children: [...children],
        } as ILayoutNode;
        this.parent.update(newValue);
        // Update parent with new value
      }
    }
  }
  public splitBottom(viewId: string) {
    if (!this.parent) {
      console.log("parent=undefined");
      const newValue = {
        name: "div",
        viewId: "",
        children: [
          this.toLayout(),
          {
            name: "view",
            viewId: viewId,
          },
        ],
      } as ILayoutNode;
      this.update(newValue);
      // Update parent with new value
    } else {
      console.log("parent=" + this.parent.name);
      if (this.parent!.getSnapshot().name === "flex") {
        const newValue = {
          name: "div",
          viewId: "",
          children: [
            this.toLayout(),
            {
              name: "view",
              viewId: viewId,
            },
          ],
        } as ILayoutNode;
        this.update(newValue);
        // Update parent with new value
      } else if (this.parent!.getSnapshot().name === "div") {
        const children = this.parent.toLayout().children;
        const index = children.findIndex((l) => l.viewId === this.viewId);
        children.splice(index + 1, 0, {
          name: "view",
          viewId: viewId,
        });
        const newValue = {
          ...this.parent.toLayout(),
          children: [...children],
        } as ILayoutNode;
        this.parent.update(newValue);
        // Update parent with new value
      }
    }
  }

  public splitExtremeBottom(viewId: string) {
    if (!this.parent) {
      console.log("parent=undefined");
      const newValue = {
        name: "div",
        viewId: "",
        children: [
          this.toLayout(),
          {
            name: "view",
            viewId: viewId,
          },
        ],
      } as ILayoutNode;
      this.update(newValue);
      // Update parent with new value
    } else {
      console.log("parent=" + this.parent.name);
      if (this.parent!.getSnapshot().name === "flex") {
        const newValue = {
          name: "div",
          viewId: "",
          children: [
            this.toLayout(),
            {
              name: "view",
              viewId: viewId,
            },
          ],
        } as ILayoutNode;
        this.update(newValue);
        // Update parent with new value
      } else if (this.parent!.getSnapshot().name === "div") {
        const newValue = {
          ...this.parent.toLayout(),
          children: [
            ...this.parent.toLayout().children,
            {
              name: "view",
              viewId: viewId,
            },
          ],
        } as ILayoutNode;
        this.parent.update(newValue);
        // Update parent with new value
      }
    }
  }

  public toLayout(): ILayoutNode {
    return {
      name: this.name,
      viewId: this.viewId,
      children: this.children,
    };
  }
}
