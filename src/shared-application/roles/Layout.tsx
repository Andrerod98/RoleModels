import EventEmitter from "events";
import { uuid } from "uuidv4";
import { ILayoutNode } from "./ILayout";

export class LayoutNode extends EventEmitter {
  parent: LayoutNode;
  children: LayoutNode[];
  name: "view" | "flex" | "div";
  viewId: string;
  id: string;

  constructor(model: ILayoutNode, parent?: LayoutNode) {
    super();
    this.parent = parent;
    this.children = [];

    this.id = model.id;
    this.name = model.name;
    this.viewId = model.viewId;

    if (model.children) {
      model.children.forEach((child) => this.addChild(child));
    }
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getViewId() {
    return this.viewId;
  }

  getRoot(): LayoutNode {
    if (this.parent == null) {
      return this;
    } else {
      return this.parent.getRoot();
    }
  }

  getChildByID(id: string): LayoutNode {
    return this.searchInNode(this, id, false);
  }

  getChildByViewId(viewId: string): LayoutNode {
    return this.searchInNode(this, viewId, true);
  }

  public searchInNode(
    element: LayoutNode,
    matchingID: string,
    isView: boolean
  ): LayoutNode | null {
    if (
      (!isView && element.getId() == matchingID) ||
      (isView && element.getViewId() == matchingID)
    ) {
      return element;
    } else if (element.children != null) {
      let i;
      let result = null;
      for (i = 0; result == null && i < element.children.length; i++) {
        result = this.searchInNode(element.children[i], matchingID, isView);
      }
      return result;
    }
    return null;
  }

  addChild(model: ILayoutNode, index?: number) {
    if (index !== undefined) {
      this.children.splice(index, 0, new LayoutNode(model, this));
    } else {
      this.children.push(new LayoutNode(model, this));
    }
  }

  removeChild(childId: string) {
    if (this.id === childId) {
      if (this.parent) {
        this.parent.removeChild(childId);
      } else {
        this.update({
          id: this.getId(),
          viewId: "",
          name: "div",
          children: [],
        });
      }
      return;
    }
    const index = this.children.findIndex((c) => c.getId() === childId);
    if (index == -1) {
      this.children.forEach((child) => {
        child.removeChild(childId);
      });
    } else {
      this.children[index].setParent(undefined);
      this.children.splice(index, 1);
      if (this.children.length === 0) {
        this.parent.removeChild(this.getId());
      } else {
        this.getRoot().emit("change", this.getRoot().toLayout());
      }
    }
  }

  public toViewsIds(): string[] {
    let viewsIds = [];
    if (this.viewId != "") viewsIds = [this.viewId];

    for (const child of this.children) {
      viewsIds = [...viewsIds, ...child.toViewsIds()];
    }

    return viewsIds;
  }

  public setParent(node: LayoutNode) {
    this.parent = node;
  }

  public update(model: ILayoutNode) {
    this.id = model.id;
    this.name = model.name;
    this.viewId = model.viewId;

    this.children.forEach((child) => child.setParent(undefined));
    this.children.length = 0;

    if (model.children) {
      model.children.forEach((child) => this.addChild(child));
    }

    this.getRoot().emit("change", this.getRoot().toLayout());
  }

  public getChildren() {
    return this.children;
  }

  public groupWith(name: string, newView: ILayoutNode, isFirst: boolean) {
    if (isFirst) {
      this.update({
        id: uuid(),
        name: name,
        viewId: "",
        children: [newView, this.toLayout()],
      } as ILayoutNode);
    } else {
      this.update({
        id: uuid(),
        name: name,
        viewId: "",
        children: [this.toLayout(), newView],
      } as ILayoutNode);
    }
  }

  public splitRight(viewId: string, isExtreme: boolean) {
    // if the parent is a flex then add view to parent right next to it
    // if the parent is a div then add flex with view
    const newView = {
      id: uuid(),
      name: "view",
      viewId: viewId,
    } as ILayoutNode;

    if (this.parent) {
      switch (this.parent.getName()) {
        case "div":
          this.groupWith("flex", newView, false);
          break;
        case "flex":
          if (isExtreme) {
            this.parent.addChild(newView);
          } else {
            const index = this.parent
              .getChildren()
              .findIndex((l) => l.getId() === this.getId());
            this.parent.addChild(newView, index + 1);
          }
          break;
        default:
          break;
      }
    } else {
      this.groupWith("flex", newView, false);
    }
  }

  public splitLeft(viewId: string, isExtreme: boolean) {
    const newView = {
      id: uuid(),
      name: "view",
      viewId: viewId,
    } as ILayoutNode;

    if (this.parent) {
      switch (this.parent.getName()) {
        case "div":
          this.groupWith("flex", newView, true);
          break;
        case "flex":
          if (isExtreme) {
            this.parent.addChild(newView, 0);
          } else {
            const index = this.parent
              .getChildren()
              .findIndex((l) => l.getId() === this.getId());

            this.parent.addChild(newView, index);
          }

          break;
        default:
          break;
      }
    } else {
      this.groupWith("flex", newView, true);
    }
  }

  public splitTop(viewId: string, isExtreme: boolean) {
    const newView = {
      id: uuid(),
      name: "view",
      viewId: viewId,
    } as ILayoutNode;

    if (this.parent) {
      switch (this.parent.getName()) {
        case "flex":
          this.groupWith("div", newView, true);
          break;
        case "div":
          if (isExtreme) {
            this.parent.addChild(newView, 0);
          } else {
            const index = this.parent
              .getChildren()
              .findIndex((l) => l.getId() === this.getId());

            this.parent.addChild(newView, index);
          }

          break;
        default:
          break;
      }
    } else {
      this.groupWith("div", newView, true);
    }
  }

  public splitBottom(viewId: string, isExtreme: boolean) {
    const newView = {
      id: uuid(),
      name: "view",
      viewId: viewId,
    } as ILayoutNode;

    if (this.parent) {
      switch (this.parent.getName()) {
        case "flex":
          this.groupWith("div", newView, false);
          break;
        case "div":
          if (isExtreme) {
            this.parent.addChild(newView);
          } else {
            const index = this.parent
              .getChildren()
              .findIndex((l) => l.getId() === this.getId());

            this.parent.addChild(newView, index + 1);
          }

          break;
        default:
          break;
      }
    } else {
      this.groupWith("div", newView, false);
    }
  }

  public toLayout(): ILayoutNode {
    return {
      id: this.id,
      name: this.name,
      viewId: this.viewId,
      children: this.children.map((child) => child.toLayout()),
    };
  }
}
