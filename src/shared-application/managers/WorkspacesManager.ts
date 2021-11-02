import { SharedCell } from "@fluidframework/cell";
import { SharedMap } from "@fluidframework/map";
import EventEmitter from "events";
import { uuid } from "uuidv4";
import { LayoutNode } from "../workspaces/LayoutNode";
import { RoleModelsDataObject } from "../shared-object/RoleModelsDataObject";
import { IWorkspace } from "../workspaces/IWorkspace";
import { SharedWorkspaces } from "../workspaces/SharedWorkspaces";
import { SharedWorkspace } from "../workspaces/SharedWorkspace";
import { Workspace } from "../workspaces/Workspace";
import { Mode } from "../../context/Modes";

enum ConfigurationsManagerEvents {
  ChangeState = "changeState",
}

/*
export interface Workspace {
  id: string;
  name: string;
  layouts: {
    [role: string]: { layout: LayoutNode; type: string; name: string };
  };
}
*/

/* This class is responsible for managing the combined views */
export class WorkspacesManager extends EventEmitter {
  current: SharedWorkspace;
  primary: SharedWorkspace;

  lastWorkspaces: SharedWorkspaces;
  allWorkspaces: SharedWorkspaces;

  public constructor(
    private readonly app: RoleModelsDataObject,
    private readonly workspacesSharedMap: SharedMap,
    private readonly primaryWorkspacesSharedMap: SharedMap,
    private readonly currentWorkspace: SharedCell,
    private readonly primaryWorkspace: SharedCell
  ) {
    super();

    this.lastWorkspaces = new SharedWorkspaces(
      this.primaryWorkspacesSharedMap,
      this.emitChange
    );
    this.allWorkspaces = new SharedWorkspaces(
      workspacesSharedMap,
      this.emitChange
    );

    this.current = new SharedWorkspace(currentWorkspace, this.emitChange);

    this.primary = new SharedWorkspace(this.primaryWorkspace, this.emitChange);
  }

  public getCurrentWorkspace(): SharedWorkspace {
    return this.current;
  }

  public getCurrentLayoutOfRole(roleID: string): LayoutNode {
    if (this.current.get().getRoleLayout(roleID)) {
      return this.current.get().getRoleLayout(roleID).getLayout();
    } else {
      return undefined;
    }
  }

  public getPrimaryWorkspace(nDevices: number) {
    if (nDevices === 1) return this.primary.get();
    else {
      const id = "" + nDevices;
      return this.lastWorkspaces.get(id);
    }
  }

  public saveLastWorkspace(nDevices: number) {
    if (nDevices > 1) {
      const id = "" + nDevices;
      const value = this.current.get().toWorkspace();

      console.log(value);

      this.lastWorkspaces.set(id, { ...value });
    }
  }

  public renameWorkspace(id: string, oldName: string, newName: string) {
    if (this.current.get().getName() === oldName) {
      const configValue = this.currentWorkspace.get();
      this.current.set({ ...configValue, name: newName });
    }

    this.allWorkspaces.set(id, {
      ...this.workspacesSharedMap.get(id),
      name: newName,
    });

    this.emitChange();
  }

  public clearContainers() {
    this.primary.resetLayouts();
    this.current.resetLayouts();
  }

  public removeContainerFromAllRoles(containerID: string, isPrimary = false) {
    const roles = isPrimary
      ? this.primary.get().getRoleLayouts().values()
      : this.current.get().getRoleLayouts().values();

    for (const role of roles) {
      role.getLayout().getChildByViewId(containerID).removeAllListeners();
      const nodeID = role.getLayout().getChildByViewId(containerID).getId();
      role.getLayout().removeChild(nodeID);
      role.getLayout().sync();
    }
  }

  public removeContainerFromRole(roleId: string, containerID: string) {
    this.current
      .get()
      .getRoleLayout(roleId)
      .getLayout()
      .getChildByViewId(containerID)
      .removeAllListeners();

    const nodeID = this.current
      .get()
      .getRoleLayout(roleId)
      .getLayout()
      .getChildByViewId(containerID)
      .getId();
    this.current.get().getRoleLayout(roleId).getLayout().removeChild(nodeID);

    this.current.get().getRoleLayout(roleId).getLayout().sync();
  }

  /* Returns all the workspaces */
  public getWorkspaces(): IterableIterator<Workspace> {
    return this.allWorkspaces.getWorkspaces().values();
  }

  public loadWorkspace(workspace: IWorkspace): void {
    this.app.setMode(Mode.SettingUp);

    const newWorkspace = this.app.setRoles(workspace);

    this.current.set({ ...newWorkspace });

    setTimeout(() => {
      this.app.setMode(Mode.Default);
      this.app.assignRolesToDevices(newWorkspace);
    }, 2000);
  }

  public deleteWorkspace(workspaceID: string): void {
    this.allWorkspaces.deleteWorkspace(workspaceID);
  }

  public saveWorkspace(name: string) {
    const id = uuid();
    const value = { ...this.current.get().toWorkspace() };
    this.current.set({
      layouts: value.layouts,
      id: id,
      name: name,
    });

    const layouts = {};
    const rolesIDs = Object.keys(value.layouts);
    for (const key of rolesIDs) {
      const role = this.app.getRole(key);
      const roleId = role.getId();
      const roleName = role.getName();
      layouts[roleId] = {
        layout: value.layouts[key].layout,
        type: this.app.getDeviceTypeOfRole(roleId),
        name: roleName,
      };
    }
    this.allWorkspaces.set(id, {
      id,
      name: name,
      layouts: layouts,
    });
  }

  public getWorkspacesWithNDevices(quantity: number): Workspace[] {
    return this.allWorkspaces.getWorkspacesWithNDevices(quantity);
  }

  public resetWorkspace(roleID: string) {
    const layouts = {};

    const entries = this.current.get().getRoleLayouts().entries();

    for (const [key, value] of entries) {
      layouts[key] = {
        ...value,
        layout: {
          id: uuid(),
          name: "div",
        },
      };
    }

    layouts[roleID].layout = this.primary
      .get()
      .getFirstLayout()
      .toLayout().layout;

    this.current.set({
      ...this.current.get().toWorkspace(),
      layouts: { ...layouts },
    });
  }

  /* Callback functions */

  private emitChange = (message?: string) => {
    this.emit(ConfigurationsManagerEvents.ChangeState, message);
  };
}

/*public loadObject() {
    const currentConfigValue = this.currentWorkspace.get();

    const currentConfigKeys = Object.keys(currentConfigValue.layouts);

    if (this.current) {
      const currentKeys = Object.keys(this.current.layouts);

      for (const key of currentKeys) {
        this.current.layouts[key].layout.removeAllListeners();
      }
    }

    this.current = {
      id: currentConfigValue.id,
      name: currentConfigValue.name,
      layouts: {},
    };

    for (const key of currentConfigKeys) {
      const layoutValue = currentConfigValue.layouts[key];
      this.current.layouts[key] = {
        layout: new LayoutNode(layoutValue.layout),
        type: layoutValue.type,
        name: layoutValue.name,
      };
      this.current.layouts[key].layout.getRoot().on("change", (l) => {
        this.updateCurrent(key, l);
      });
    }
  }
*/
