import { SharedCell } from "@fluidframework/cell";
import {
  IUIComponent,
  UIComponentController,
} from "../../components/UIComponent";
import { FactoriesManager } from "../../FactoriesManager";
import { IView } from "../../views/IView";
import { View } from "../../views/View";
import { CombinedView } from "../combined-view/CombinedView";
import { IMultiViewCombinedView } from "./IMultiViewCombinedView";

export interface IMultiCombinedViewManager {
  // Multiple components manipulation
  getUIFrom(role: string): View;

  switchUIs(role1: string, role2: string): void;

  updateMultiple(inRole: string, ...components: IUIComponent[]): void;
  moveMultiple(
    fromRole: string,
    toRole: string,
    ...components: IUIComponent[]
  ): void;
  removeMultiple(inRole: string, ...components: IUIComponent[]): void;
  addMultiple(toRole: string, ...components: IUIComponent[]): void;

  // Individual components manipulation
  get(id: string, inRole: string): UIComponentController;
  update(component: IUIComponent, inRole: string): void;
  // move(fromRole: string, toRole: string, component: IUIComponent): void;
  remove(id: string, inRole: string): void;
  add(component: IUIComponent, toRole: string): void;
}

export class MultiCombinedView
  extends CombinedView
  implements IMultiCombinedViewManager
{
  roleMap: Map<string, View>;
  public constructor(
    protected readonly combinedView: SharedCell,
    protected readonly factoriesManager: FactoriesManager
  ) {
    super(combinedView);
    this.roleMap = new Map<string, View>();

    this.initializeObject();
    this.setEventListener();
  }

  private initializeObject() {
    Object.keys(this.combinedView.get().roleMap).forEach((role) =>
      this.roleMap.set(
        role,
        View.from(this.combinedView.get().roleMap[role], this.factoriesManager)
      )
    );
  }
  /* Loads all the objects in the shared Cell */
  setEventListener() {
    this.combinedView.on("valueChanged", () => {
      this.updateObjects();
    });
  }

  /* Updates all objects in shared cell */
  updateObjects() {
    Object.keys(this.combinedView.get().roleMap).forEach((role) =>
      this.roleMap.get(role).update(this.combinedView.get().roleMap[role])
    );
  }

  updateViews() {
    const map = this.getCombinedView().roleMap;

    Object.keys(this.combinedView.get().roleMap).forEach(
      (role) => (map[role] = this.roleMap.get(role).toView())
    );
    this.combinedView.set({
      ...this.combinedView.get(),
      roleMap: map,
    });
  }

  existRole(role: string): boolean {
    return this.roleMap.has(role);
  }

  toCombinedView(): IMultiViewCombinedView {
    const cell = this.combinedView.get();
    return {
      id: cell.id,
      type: cell.type,
      color: cell.color,
      roleMap: cell.roleMap,
    };
  }

  public getUIFrom(role: string): View {
    return this.roleMap.get(role);
  }

  public isSingleView = () => false;

  public isMultiView = () => true;

  public has(id: string, role: string): boolean {
    if (!this.existRole(role)) {
      console.error("The role " + role + " does not exist.");
    }

    return this.getUIFrom(role).getComponentByID(id) != null;
  }

  /* Returns the UI component shared object with id */
  public get(id: string, inRole: string): UIComponentController {
    if (!this.existRole(inRole)) {
      console.error("The role " + inRole + " does not exist.");
    }

    const result = this.roleMap.get(inRole).getComponentByID(id);

    if (result === null)
      console.error(`Shared UI component object with id ${id} not found.`);
    else return result;
  }

  /* Updates the component in the shared object */
  public update(component: IUIComponent, inRole: string): void {
    if (!this.existRole(inRole)) {
      console.error("The role " + inRole + " does not exist.");
    }

    const controller = this.getUIFrom(inRole).getComponentByID(component.id);

    /* const list = [
      ...this.getUIFrom(inRole)
        .getComponents()
        .map((c) => c.component),
    ];
    let totalUpdated = 0;

    list.forEach((c: IUIComponent, index: number) => {
      if (c.id == component.id) {
        list[index] = component;
        totalUpdated++;
      }
    });*/

    if (controller == null) {
      console.error(
        `The component with id ${component.id} was not found therefore was not updated.`
      );
    } else {
      controller.update(component);
      this.updateViews();
    }
  }

  /* public move(fromRole: string, toRole: string, component: IUIComponent): void {
    if (!this.existRole(fromRole)) {
      console.error("The role " + fromRole + " does not exist.");
      return;
    }

    if (!this.existRole(toRole)) {
      console.error("The role " + toRole + " does not exist.");
      return;
    }

    const myUI = [
      ...this.getUIFrom(fromRole)
        .getComponents()
        .map((c) => c.component),
    ];
    const index = myUI.findIndex((c: IUIComponent) => c.id === component.id);

    if (index === -1) {
      console.error(
        `The component with id ${component.id} does not exist so it was not moved.`
      );
    } else {
      const toUI = [
        ...this.getUIFrom(toRole)
          .getComponents()
          .map((c) => c.component),
      ];
      myUI.splice(index, 1);
      toUI.push(component);

      const map = this.getCombinedView().roleMap;
      map[fromRole] = { ...map[fromRole], components: myUI };
      map[toRole] = { ...map[toRole], components: toUI };

      this.combinedView.set({
        ...this.combinedView.get(),
        roleMap: map,
      });
    }
  }*/

  public remove(id: string, inRole: string): void {
    if (!this.existRole(inRole)) {
      console.error("The role " + inRole + " does not exist.");
      return;
    }

    const index = this.getCombinedView().roleMap[inRole].components.findIndex(
      (component: IUIComponent) => component.id === id
    );

    if (index === -1)
      console.error(
        `The component with id ${id} was not found therefore was not removed.`
      );
    else this.getCombinedView().roleMap[inRole].components.splice(index, 1);
  }

  public add(component: IUIComponent, toRole: string): void {
    if (!this.existRole(toRole)) {
      console.error("The role " + toRole + " does not exist.");
      return;
    }

    const list = this.getCombinedView().roleMap[toRole];
    if (this.has(component.id, toRole)) {
      console.error(
        `The component with id ${component.id} already exists so it was not added.`
      );
    } else {
      const map = this.getCombinedView().roleMap;
      map[toRole].components = [...list.components, component];
      this.combinedView.set({
        ...this.combinedView.get(),
        roleMap: map,
      });
    }
  }

  updateMultiple(inRole: string, ...components: IUIComponent[]) {
    if (!this.existRole(inRole)) {
      console.error("The role " + inRole + " does not exist.");
      return;
    }

    const list = [...this.getCombinedView().roleMap[inRole].components];
    let totalUpdated = 0;

    components.forEach((c: IUIComponent) => {
      const i = list.findIndex(
        (component: IUIComponent) => component.id === c.id
      );

      if (i != -1) {
        list[i] = c;
        totalUpdated++;
      }
    });

    if (totalUpdated == 0 || totalUpdated < components.length) {
      console.error(
        `The components where not updated because were only found ${totalUpdated}/${components.length}`
      );
    } else {
      const map = this.getCombinedView().roleMap;
      map[inRole].components = list;
      this.combinedView.set({
        ...this.combinedView.get(),
        roleMap: map,
      });
    }
  }

  removeMultiple(inRole: string, ...components: IUIComponent[]) {
    if (!this.existRole(inRole)) {
      console.error("The role " + inRole + " does not exist.");
      return;
    }

    const list = [...this.getCombinedView().roleMap[inRole].components];
    let totalRemoved = 0;

    components.forEach((c: IUIComponent) => {
      const i = list.findIndex(
        (component: IUIComponent) => component.id === c.id
      );

      if (i != -1) {
        list.splice(i, 1);
        totalRemoved++;
      }
    });

    if (totalRemoved == 0 || totalRemoved < components.length) {
      console.error(
        `The components where not updated because were only found ${totalRemoved}/${components.length}`
      );
    } else {
      const map = this.getCombinedView().roleMap;
      map[inRole].components = list;
      this.combinedView.set({
        ...this.combinedView.get(),
        roleMap: map,
      });
    }
  }

  moveMultiple(
    fromRole: string,
    toRole: string,
    ...components: IUIComponent[]
  ) {
    if (!this.existRole(fromRole)) {
      console.error("The role " + fromRole + " does not exist.");
      return;
    }

    if (!this.existRole(toRole)) {
      console.error("The role " + toRole + " does not exist.");
      return;
    }
    let totalMoved = 0;
    const fromList = [...this.getCombinedView().roleMap[fromRole].components];
    const toList = [...this.getCombinedView().roleMap[toRole].components];

    components.forEach((c: IUIComponent) => {
      const index = this.getCombinedView().roleMap[
        fromRole
      ].components.findIndex(
        (component: IUIComponent) => c.id === component.id
      );
      if (index === -1)
        console.error(
          `The component with id ${index} was not found therefore was not removed.`
        );
      else {
        totalMoved++;
        fromList.splice(index, 1);
        toList.push(c);
      }
    });

    if (totalMoved == 0 || totalMoved < components.length) {
      console.error(
        `The components where not moved because were only found ${totalMoved}/${components.length}`
      );
    } else {
      const map = this.getCombinedView().roleMap;
      map[fromRole].components = fromList;
      map[toRole].components = toList;
      this.combinedView.set({
        ...this.getCombinedView(),
        roleMap: map,
      });
    }
  }

  addMultiple(toRole: string, ...components: IUIComponent[]) {
    if (!this.existRole(toRole)) {
      console.error("The role " + toRole + " does not exist.");
      return;
    }

    const list = [...this.getCombinedView().roleMap[toRole].components];
    let totalAdded = 0;
    components.forEach((c: IUIComponent) => {
      if (!this.has(c.id, toRole)) {
        totalAdded++;
        list.push(c);
      }
    });

    if (totalAdded == 0 || totalAdded < components.length) {
      console.error(
        `The components where not added because were only found ${totalAdded}/${components.length}`
      );
    } else {
      const map = this.getCombinedView().roleMap;
      map[toRole].components = list;
      this.combinedView.set({
        ...this.combinedView.get(),
        roleMap: map,
      });
    }
  }

  public switchUIs(role1: string, role2: string): void {
    if (!this.existRole(role1)) {
      console.error("The role " + role1 + " does not exist.");
      return;
    }

    if (!this.existRole(role2)) {
      console.error("The role " + role2 + " does not exist.");
      return;
    }
    const role1UI = this.getCombinedView().roleMap[role1];
    const role2UI = this.getCombinedView().roleMap[role2];
    const roleMap = {
      ...this.getCombinedView().roleMap,
    };

    roleMap[role1] = role2UI;
    roleMap[role2] = role1UI;
    this.combinedView.set({
      ...this.combinedView.get(),
      roleMap: roleMap,
    });
  }

  public updateView(view: IView, inRole: string) {
    if (!this.existRole(inRole)) {
      console.error("The role " + inRole + " does not exist.");
      return;
    }

    const roleMap = {
      ...this.getCombinedView().roleMap,
    };

    roleMap[inRole] = view;
    this.combinedView.set({
      ...this.combinedView.get(),
      roleMap: roleMap,
    });
  }

  public overrideAll(components: IUIComponent[], inRole: string) {
    if (!this.existRole(inRole)) {
      console.error("The role " + inRole + " does not exist.");
      return;
    }
    const list = this.combinedView.get().roleMap;
    list[inRole] = components;
    this.combinedView.set({
      ...this.combinedView.get(),
      roleMap: list,
    });
  }
}
