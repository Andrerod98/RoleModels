import {
  DefaultNodeModel,
  NodeModelListener,
} from "@projectstorm/react-diagrams";
import { ViewNodeModel } from "../view-node/ViewNodeModel";

export class RoleNodeModel extends DefaultNodeModel {
  items: ViewNodeModel[];
  constructor(type: string, name: string) {
    super({
      type: type,
      color: "white",
      name: name,
    });
    this.setLocked(true);
    this.updateDimensions({ width: 250, height: 250 });
    this.items = [];
  }

  public addItem(item: ViewNodeModel) {
    if (this.items.includes(item)) {
      return;
    }
    this.items.push(item);
    item.setRole(this);
    console.log(item.getRole());
    item.setPosition(this.getX(), this.getY());
    const listener: NodeModelListener = {
      positionChanged: (e: any) => {
        const { x, y } = e.entity.position;
        if (x < this.getX() && y < this.getY())
          item.setPosition(this.getX(), this.getY());
        else if (x < this.getX()) item.setPosition(this.getX(), item.getY());
        else if (y < this.getY()) item.setPosition(item.getX(), this.getY());
        else if (y > this.getY() + this.height - item.height)
          item.setPosition(
            item.getX(),
            this.getY() + this.height - item.height
          );
        else if (x > this.getX() + this.width - item.width)
          item.setPosition(this.getX() + this.width - item.width, item.getY());
      },
    };
    item.registerListener(listener);
  }

  public removeItem(item: ViewNodeModel) {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

  public getItems() {
    return this.items;
  }
}
