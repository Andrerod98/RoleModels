import { DefaultNodeModel } from "@projectstorm/react-diagrams";

export class QRNodeModel extends DefaultNodeModel {
  constructor(type: string, name: string) {
    super({
      type: type,
      color: "white",
      name: name,
    });

    this.updateDimensions({ width: 250, height: 250 });
  }
}
