import EventEmitter from "events";
import { uuid } from "uuidv4";
import { ILayoutNode } from "./ILayoutNode";

export class LayoutNode extends EventEmitter {
  id: string;
  name: "view" | "flex" | "div";
  viewId: string;
  parent: LayoutNode;
  children: LayoutNode[];
  flexGrow: boolean;

  constructor(model: ILayoutNode, parent?: LayoutNode) {
    super();

    this.id = model.id;
    this.name = model.name;
    this.viewId = model.viewId;
    this.flexGrow = model.flexGrow;
    this.parent = parent;
    this.children = [];
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

  getFlexGrow() {
    return this.flexGrow;
  }

  getChildren() {
    return this.children;
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

  toViewsIds(): string[] {
    let viewsIds = [];
    if (this.viewId != "") viewsIds = [this.viewId];

    for (const child of this.children) {
      viewsIds = [...viewsIds, ...child.toViewsIds()];
    }

    return viewsIds;
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
    const index = this.children.findIndex((c) => c.getId() === childId);

    if (index == -1) {
      this.children.forEach((child) => {
        child.removeChild(childId);
      });
    } else {
      this.children.splice(index, 1);
      if (this.children.length === 0) {
        if (this.parent) {
          this.parent.removeChild(this.getId());
        }
      }
    }
  }

  public setParent(node: LayoutNode) {
    this.parent = node;
  }

  public update(model: ILayoutNode) {
    this.id = model.id;
    this.name = model.name;
    this.viewId = model.viewId;
    this.flexGrow = model.flexGrow;

    this.children.forEach((child) => child.setParent(undefined));
    this.children.length = 0;

    if (model.children) {
      model.children.forEach((child) => this.addChild(child));
    }
  }

  public sync() {
    this.getRoot().emit("change", this.getRoot().toLayout());
  }

  public replace(model: ILayoutNode) {
    this.update(model);
    this.sync();
  }

  public groupWith(name: string, newView: ILayoutNode, isFirst: boolean) {
    if (isFirst) {
      this.update({
        id: uuid(),
        name: name,
        viewId: "",
        flexGrow: this.flexGrow,
        children: [newView, this.toLayout()],
      } as ILayoutNode);
    } else {
      this.update({
        id: uuid(),
        name: name,
        viewId: "",
        flexGrow: this.flexGrow,
        children: [this.toLayout(), newView],
      } as ILayoutNode);
    }
  }

  public splitRight(viewId: string, isExtreme: boolean, flexGrow: boolean) {
    // if the parent is a flex then add view to parent right next to it
    // if the parent is a div then add flex with view
    const newView = {
      id: uuid(),
      name: "view",
      viewId: viewId,
      flexGrow: flexGrow,
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

    this.sync();
  }

  public splitLeft(viewId: string, isExtreme: boolean, flexGrow: boolean) {
    const newView = {
      id: uuid(),
      name: "view",
      viewId: viewId,
      flexGrow: flexGrow,
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
    this.sync();
  }

  public splitTop(viewId: string, isExtreme: boolean, flexGrow: boolean) {
    const newView = {
      id: uuid(),
      name: "view",
      viewId: viewId,
      flexGrow: flexGrow,
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
    this.sync();
  }

  public splitBottom(viewId: string, isExtreme: boolean, flexGrow: boolean) {
    const newView = {
      id: uuid(),
      name: "view",
      viewId: viewId,
      flexGrow: flexGrow,
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
    this.sync();
  }

  public toLayout(): ILayoutNode {
    return {
      id: this.id,
      name: this.name,
      viewId: this.viewId,
      flexGrow: this.flexGrow,
      children: this.children.map((child) => child.toLayout()),
    };
  }
}
