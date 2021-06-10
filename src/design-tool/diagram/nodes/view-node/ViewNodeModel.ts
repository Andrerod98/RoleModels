import { DefaultNodeModel } from "@projectstorm/react-diagrams";
import { View } from "../../../../prototyping-tool/shared-object/views/View";
import { RoleNodeModel } from "../role-node/RoleNodeModel";

export class ViewNodeModel extends DefaultNodeModel {
  parentNode: RoleNodeModel | null;
  view: View;
  constructor(type: string, name: string, view: View) {
    super({
      type: type,
      color: "white",
      name: name,
    });
    this.updateDimensions({ width: 0, height: 0 });
    this.parentNode = null;
    this.view = view;
  }

  getRole(): any {
    return this.parentNode;
  }

  getView(): View {
    return this.view;
  }

  setView(view: View) {
    this.view = view;
  }

  hasRole() {
    return this.parentNode != null;
  }

  setRole(model: RoleNodeModel | null) {
    this.parentNode = model;
  }

  /*
  setPosition(x: number, y: number): any {
    if (
      (this.parentNode != null && x < this.parentNode!.getX()) ||
      x > this.parentNode!.getX() + this.parentNode!.width ||
      y < this.parentNode!.getY() ||
      y > this.parentNode!.getY() + this.parentNode!.height
    )
      return;

    super.setPosition(x, y);
  }*/
}
