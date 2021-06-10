import * as FileSaver from "file-saver";
import EventEmitter from "events";

import { Diagram } from "./diagram/Diagram";
import { RoleNodeModel } from "./diagram/nodes/role-node/RoleNodeModel";
import { ViewNodeModel } from "./diagram/nodes/view-node/ViewNodeModel";
import { Utils } from "./Utils";
import { DefaultLinkModel } from "@projectstorm/react-diagrams";
import { LayoutManager } from "./components/single-tab/LayoutManager";

import { CrossDeviceApplication } from "../prototyping-tool/Application";
import { IUIComponent } from "../prototyping-tool/shared-object/components/UIComponent";
import { FactoriesManager } from "../prototyping-tool/shared-object/FactoriesManager";
import { IRole } from "../prototyping-tool/shared-object/roles/IRole";
import { IView } from "../prototyping-tool/shared-object/views/IView";
import { View } from "../prototyping-tool/shared-object/views/View";
/* eslint-disable @typescript-eslint/no-empty-function */
export class Project extends EventEmitter {
  private template: ITemplate;
  private fileSelector;
  private factoriesManager: FactoriesManager;
  private rolesLayout: Map<string, LayoutManager>;

  private diagram: Diagram;
  private templates: ITemplate[] = [
    {
      name: "Capturer + Viewer",
      description: "This is a description",
      roles: [],
      devices: [],
      views: [],
    },
    {
      name: "Capturer + Viewer",
      description: "This is a description",
      roles: [],
      devices: [],
      views: [],
    },
    {
      name: "Capturer + Viewer",
      description: "This is a description",
      roles: [],
      devices: [],
      views: [],
    },
  ];

  constructor(private name: string) {
    super();
    this.template = this.templates[0];
    this.fileSelector = this.buildFileSelector();
    this.diagram = new Diagram();
    this.rolesLayout = new Map<string, LayoutManager>();
    this.rolesLayout.set("individual", new LayoutManager(this.changeEmitter));
  }

  onDropCanvas = (event: any) => {
    const data = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));
    /* const nodesCount = _.keys(
          this.props.app.getDiagramEngine().getModel().getNodes()
        ).length;*/

    let node = null;
    console.log(data);

    node = new ViewNodeModel(data.type, "teste", View.from(data.view));

    const point = this.diagram.getDiagramEngine().getRelativeMousePoint(event);
    node.setPosition(point);
    this.diagram.getDiagramEngine().getModel().addNode(node);
    this.diagram.getDiagramEngine().repaintCanvas();
  };

  zoomIn = () => {
    this.diagram
      .getActiveDiagram()
      .setZoomLevel(this.diagram.getActiveDiagram().getZoomLevel() + 5);

    this.diagram.getDiagramEngine().repaintCanvas();
  };

  zoomOut = () => {
    this.diagram
      .getActiveDiagram()
      .setZoomLevel(this.diagram.getActiveDiagram().getZoomLevel() - 5);
    this.diagram.getDiagramEngine().repaintCanvas();
  };

  zoomToFit = () => {
    this.diagram.getDiagramEngine().zoomToFit();
    this.diagram.getDiagramEngine().repaintCanvas();
  };
  addQr = () => {
    const node6 = new RoleNodeModel("qr", "Capturer");
    node6.setPosition(0, 108);
    this.diagram.getActiveDiagram().addNode(node6);
    this.diagram.getDiagramEngine().repaintCanvas();
  };

  public getDiagram() {
    return this.diagram;
  }

  private buildFileSelector() {
    const fileSelector = document.createElement("input");
    fileSelector.setAttribute("type", "file");
    fileSelector.setAttribute("multiple", "multiple");
    fileSelector.addEventListener("change", () => {
      const fileList = fileSelector.files;
      if (fileList != null) this.loadFile(fileList[0]);
    });
    return fileSelector;
  }
  public getFactoriesManager() {
    return this.factoriesManager;
  }
  public generateComponent(component: IUIComponent) {
    return this.factoriesManager.getUIComponent(component).generateWidget();
  }

  public async loadFile(file: File): Promise<void> {
    const data = await file.text();

    this.template = JSON.parse(data);
    console.log(this.template);
    this.emit("change");
    //rerender
  }

  public loadTemplate(templateStr: string): void {
    console.log(templateStr);
    const template = JSON.parse(templateStr);
    console.log(template);
  }

  public saveProject(): void {
    console.log(this.template);
    const temp = this.template;
    const file = new File([JSON.stringify(temp)], this.name + ".json", {
      type: "application/json;charset=utf-8",
    });
    FileSaver.saveAs(file);
  }

  public viewsToString = (views: IView[]) => {
    let fullStr = "";
    views.forEach((view) => {
      fullStr = fullStr + Utils.jsonToString(view);
    });
    return fullStr;
  };

  public changeEmitter(): void {
    this.emit("change");
  }
  public openProject(): void {
    this.fileSelector.click();
  }

  public onRightClickSelect(label: string) {
    this.diagram
      .getActiveDiagram()
      .getSelectedEntities()
      .forEach((model: any) => {
        const model2 = model as ViewNodeModel;
        const node1 = new ViewNodeModel("button", "View 1", model2.view);
        node1.setPosition(100, 108);

        const portIn = node1.addInPort("Teste1");
        const portOut = model2.addOutPort("Teste2");
        const link1 = portOut.link<DefaultLinkModel>(portIn);
        link1.getOptions().testName = "Test";
        link1.addLabel(label);
        this.diagram.getActiveDiagram().addAll(node1, link1);
      });

    this.diagram.getDiagramEngine().repaintCanvas();
  }

  public getLayoutManager(role: string): LayoutManager {
    return this.rolesLayout.get(role);
  }

  public getRoles() {
    return this.rolesLayout.keys();
  }

  public addRole(role: string) {
    this.rolesLayout.set(role, new LayoutManager(this.changeEmitter));
    this.emit("change");
  }

  public removeRole(role: string) {
    this.rolesLayout.delete(role);
    this.emit("change");
  }
  public renameRole(role: string, nextValue: string) {
    this.rolesLayout.set(nextValue, this.rolesLayout.get(role));
    this.rolesLayout.delete(role);

    console.log(this.rolesLayout.get(nextValue));
    this.emit("change");
  }

  public addView(view: IView): void {}

  public removeView() {}

  public addQR() {}

  public getCombinedViews() {}

  // public getTemplates() {}

  // public addTemplate() {}

  public getTemplate(): ITemplate {
    return this.template;
  }

  public mirror() {}

  public stitch() {}

  public combine() {}

  public prototype() {
    const application = new CrossDeviceApplication("127.0.0.1", this.name);

    application
      .start()
      .catch((e) => {
        console.error(e);
        console.log(
          "%cEnsure you are running the Tinylicious Fluid Server\nUse:`npm run start:server`",
          "font-size:30px"
        );
      })
      .then(async () => {
        if (application.isFirstClient()) {
          for (const role of this.rolesLayout.keys()) {
            const r = application.addRole(role);
            const views = this.rolesLayout.get(role).getViews();
            for (const view of views) {
              r.addView(view);
            }
          }
        }
      });
  }

  public getTemplates(): ITemplate[] {
    return this.templates;
  }

  public setTemplate(template: ITemplate) {
    this.template = template;
  }

  public addTemplate(template: ITemplate) {
    this.templates.push(template);
  }

  public setName(name: string): void {
    this.name = name;
  }
}

export interface ITemplate {
  name: string;
  description: string;
  roles: IRole[];
  devices: string[];
  views: IView[];
}
