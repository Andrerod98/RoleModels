import { SharedCell } from "@fluidframework/cell";
import {
  IUIComponent,
  UIComponentController,
} from "../../components/UIComponent";
import { FactoriesManager } from "../../FactoriesManager";
import { IView } from "../../views/IView";
import { View } from "../../views/View";
import { CombinedView } from "../combined-view/CombinedView";
import { ICombinedView } from "../combined-view/ICombinedView";
import { ISingleViewCombinedView } from "./ISingleViewCombinedView";

export interface ISingleCombinedViewManager {
  getCombinedView(): ICombinedView;

  getUI(): View;

  // Multiple components manipulation
  updateMultiple(...components: IUIComponent[]);
  removeMultiple(...components: IUIComponent[]);
  addMultiple(...components: IUIComponent[]);

  // Individual components manipulation
  get(id: string): UIComponentController;
  update(component: IUIComponent): void;
  remove(component: IUIComponent): void;
  add(component: IUIComponent): void;

  overrideAll(components: IUIComponent[]): void;
}

export class SingleCombinedView
  extends CombinedView
  implements ISingleCombinedViewManager
{
  view: View;
  public constructor(
    protected readonly combinedView: SharedCell,
    protected readonly factoriesManager: FactoriesManager
  ) {
    super(combinedView);
    this.loadObject();
    this.setEventListener();
  }

  /* Updates view in shared cell */
  updateObjects() {
    this.view.update(this.getCombinedView().view);
  }

  public getUI(): View {
    return this.view;
  }

  private loadObject() {
    this.view = View.from(this.getCombinedView().view, this.factoriesManager);
  }

  private setEventListener() {
    this.combinedView.on("valueChanged", () => {
      this.updateObjects();
    });
  }

  toCombinedView(): ISingleViewCombinedView {
    const cell = this.combinedView.get();
    return {
      id: cell.id,
      type: cell.type,
      color: cell.color,
      view: cell.view,
    };
  }

  public isSingleView = () => true;

  public isMultiView = () => false;

  public has(id: string): boolean {
    return this.getCombinedView().view.components.some(
      (component: IUIComponent) => component.id === id
    );
  }

  /* Returns the UI component shared object with id */
  public get(id: string): UIComponentController {
    const result = this.view.getComponentByID(id);
    if (result === null)
      console.error(`Shared UI component object with id ${id} not found.`);
    else return result;
  }

  /* Updates the component in the shared object */
  public update(component: IUIComponent): void {
    /* const list = this.getCombinedView().view.components;
    let totalUpdated = 0;

    list.forEach((c: IUIComponent, index: number) => {
      if (c.id == component.id) {
        // this.view.getComponents()[index].update(component);
        list[index] = component;
        totalUpdated++;
      }
    });*/
    const controller = this.view.getComponentByID(component.id);
    if (controller == null) {
      console.error(
        `The component with id ${component.id} was not found therefore was not updated.`
      );
    } else {
      controller.update(component);
      this.updateView();
      /* this.combinedView.set({
        ...this.combinedView.get(),
        view: { ...this.getCombinedView().view, components: list },
      });*/
    }
  }

  public remove(component: IUIComponent): void {
    const index = this.getCombinedView().view.components.findIndex(
      (c: IUIComponent) => c.id === component.id
    );

    if (index === -1)
      console.error(
        `The component with id ${component.id} was not found therefore was not removed.`
      );
    else this.getCombinedView().view.components.splice(index, 1);
  }

  public add(component: IUIComponent): void {
    const list = this.getCombinedView().view.components;
    if (this.has(component.id)) {
      console.error(
        `The component with id ${component.id} already exists so it was not added.`
      );
    } else {
      this.combinedView.set({
        ...this.combinedView.get(),
        view: {
          ...this.getCombinedView().view,
          components: [...list, component],
        },
      });
    }
  }

  updateMultiple(...components: IUIComponent[]) {
    const list = [...this.getCombinedView().view.components];
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
      this.combinedView.set({
        ...this.getCombinedView(),
        view: {
          ...this.getCombinedView().view,
          components: list,
        },
      });
    }
  }

  removeMultiple(...components: IUIComponent[]) {
    const list = [...this.getCombinedView().view.components];
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
        `The components where not removed because some were only found ${totalRemoved}/${components.length}`
      );
    } else {
      this.combinedView.set({
        ...this.getCombinedView(),
        view: {
          ...this.getCombinedView().view,
          components: list,
        },
      });
    }
  }
  addMultiple(...components: IUIComponent[]) {
    const list = [...this.getCombinedView().view.components];
    let totalAdded = 0;
    components.forEach((c: IUIComponent, index: number) => {
      if (!this.has(c.id)) {
        totalAdded++;
        list.push(c);
      }
    });

    if (totalAdded < components.length) {
      console.error(
        `The components where not added because some already exist. ${totalAdded}/${components.length}`
      );
    } else {
      this.combinedView.set({
        ...this.combinedView.get(),
        view: {
          ...this.getCombinedView().view,
          components: list,
        },
      });
    }
  }

  public updateView(view?: IView) {
    if (view === undefined) {
      this.combinedView.set({
        ...this.combinedView.get(),
        view: this.view.toView(),
      });
    } else {
      this.combinedView.set({
        ...this.combinedView.get(),
        view: view,
      });
    }
  }

  public overrideAll(components: IUIComponent[]) {
    this.combinedView.set({
      ...this.combinedView.get(),
      view: {
        ...this.getCombinedView().view,
        components: components,
      },
    });
  }
}
