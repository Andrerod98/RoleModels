import { ILayoutNode } from "./ILayoutNode";
import { LayoutNode } from "./LayoutNode";

export interface IRoleLayout {
  name: string;
  type: string;
  layout: ILayoutNode;
}
export class RoleLayout {
  name: string;
  type: string;
  layout: LayoutNode;

  constructor(value: IRoleLayout) {
    this.name = value.name;
    this.type = value.type;
    this.layout = new LayoutNode(value.layout);
  }

  public getName() {
    return this.name;
  }

  public getType() {
    return this.type;
  }

  public getLayout() {
    return this.layout;
  }

  public update(value: IRoleLayout) {
    this.name = value.name;
    this.type = value.type;
    this.layout.update(value.layout);
  }

  public updateLayout(layout: ILayoutNode) {
    this.layout.update(layout);
  }

  public toLayout() {
    return {
      name: this.name,
      type: this.type,
      layout: this.layout.toLayout(),
    };
  }
}
