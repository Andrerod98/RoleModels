/* eslint-disable no-undef */
import * as SRD from "@projectstorm/react-diagrams";
import { View } from "../../prototyping-tool/shared-object/views/View";
import { QRNodeFactory } from "./nodes/qr-node/QRNodeFactory";
import { RoleNodeFactory } from "./nodes/role-node/RoleNodeFactory";
import { RoleNodeModel } from "./nodes/role-node/RoleNodeModel";
import { ViewNodeFactory } from "./nodes/view-node/ViewNodeFactory";
export class Diagram {
  protected activeModel!: SRD.DiagramModel;
  protected diagramEngine: SRD.DiagramEngine;

  constructor() {
    this.diagramEngine = SRD.default();
    //this.diagramEngine.getStateMachine().setState(new NewDiagramState());
    this.initializeDiagram();
  }

  public initializeDiagram() {
    this.activeModel = new SRD.DiagramModel();

    this.diagramEngine
      .getNodeFactories()
      .registerFactory(
        new ViewNodeFactory(
          "button",
          "untitled",
          new View("id", 0, 0, "", { id: "", name: "", children: [] })
        )
      );

    this.diagramEngine
      .getNodeFactories()
      .registerFactory(new RoleNodeFactory("role", "untitled"));

    this.diagramEngine
      .getNodeFactories()
      .registerFactory(new QRNodeFactory("qr", "untitled"));

    const node4 = new RoleNodeModel("role", "Capturer");
    node4.setPosition(500, 108);

    const node5 = new RoleNodeModel("role", "Viewer");
    node5.setPosition(-100, 108);

    const node6 = new RoleNodeModel("qr", "Capturer");
    node6.setPosition(0, 108);

    this.activeModel.addAll(node4, node5, node6);

    this.diagramEngine.setModel(this.activeModel);
  }

  public getActiveDiagram(): SRD.DiagramModel {
    return this.activeModel;
  }

  public getDiagramEngine(): SRD.DiagramEngine {
    return this.diagramEngine;
  }
}
