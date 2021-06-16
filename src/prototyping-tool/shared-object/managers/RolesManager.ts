/* eslint-disable no-invalid-this */
/* eslint-disable valid-jsdoc */

import { Role } from "../roles/Role";
import { SharedMap } from "@fluidframework/map";
import { FactoriesManager } from "../FactoriesManager";
import { View } from "../views/View";
import { SharedCell } from "@fluidframework/cell";
import { IFluidHandle } from "@fluidframework/core-interfaces";

export interface IRolesManager {
  getRole: (roleName: string) => Role;
  getRoles: () => Role[];
  addRole: (sharedRole: SharedCell) => Role;

  // getCombinations(): { [role: string]: string }[];
  // switchToCombination: (combination: { [role: string]: string }) => void;

  onRolesChange(listener: () => void): this;
}

/* This class is responsible for controlling assigning the roles to the devices */
export class RolesManager implements IRolesManager {
  private roles: Map<string, Role>;

  constructor(
    readonly rolesMap: SharedMap,
    readonly factoriesManager: FactoriesManager
  ) {
    this.roles = new Map<string, Role>();
    this.setEventListener();
  }

  public async loadRoles() {
    for (const handle of this.rolesMap.values()) {
      const sharedCell = await handle.get();
      if (sharedCell !== undefined) {
        this.loadRole(sharedCell);
      }
    }
    console.log("" + this.rolesMap.size + " Roles loaded.");
  }

  private setEventListener() {
    this.rolesMap.on("valueChanged", async (e: any, ...args) => {
      const roleName = e.key;
      if (e.previousValue === undefined) {

        
        // added
        const sharedCell = await this.rolesMap
          .get<IFluidHandle<SharedCell>>(roleName)
          .get();

        sharedCell.on("valueChanged", () => {
          this.rolesMap.emit("changeState");
        });

        this.addRole(sharedCell);
        //this.roles.set(roleName, new Role(sharedCell, this.factoriesManager));
        console.log("Adding " + roleName + " from map");
        this.rolesMap.emit("changeState");
      } else {
        const role = this.rolesMap.get(roleName);
        if (role === undefined) {
          // removed
          this.roles.delete(roleName);
          // console.log("Deleting " + roleName + " from map");
        } else {
          // updated
          // console.log("Updating " + roleName + " from map");
          this.roles.get(roleName).loadObject();
        }
      }
    });
  }

  public getRole(roleName: string): Role {
    return this.roles.get(roleName);
  }

  public hasRole(roleName: string): boolean {
    return this.roles.has(roleName);
  }

  public updateViews(roleName: string): void {
    if (!this.roles.has(roleName)) {
      return;
    }
    const role = this.roles.get(roleName);
    role.updateViews(role.views);
    // this.rolesMap.set(roleName, role.toRole());
  }

  public addView(roleName: string, view: View): void {
    if (!this.roles.has(roleName)) {
      return;
    }
    const role = this.roles.get(roleName);
    role.addView(view);
    // this.rolesMap.set(roleName, role.toRole());
  }

  /* public updateRole(roleName: string, role: Role) {
    role.update(role.toRole(), this.factoriesManager);
    // this.rolesMap.set(roleName, role.toRole());
  }*/

  public removeView(roleName: string, viewId: string): void {
    if (!this.roles.has(roleName)) {
      return;
    }
    const role = this.roles.get(roleName);
    role.removeView(viewId);
    // this.rolesMap.set(roleName, role.toRole());
  }

  public loadRole(sharedRole: SharedCell): void {
    const r = new Role(sharedRole, this.factoriesManager);
    this.roles.set(r.getName(), r);
  }

  public addRole(sharedRole: SharedCell): Role {
    const role = sharedRole.get();

    const r = new Role(sharedRole, this.factoriesManager);
    this.roles.set(role.name, r);

    return r;
  }

  public removeRole(name: string): void {
    this.rolesMap.delete(name);
  }

  /* public loadRoles() {
    this.rolesMap.forEach((role: IRole) => {
      if (this.roles.has(role.name)) {
        const ro = this.roles.get(role.name);
        ro.update(role, this.factoriesManager);
        return;
      }

      const r = new Role(role.name);
      role.views.forEach((v: IView) => {
        r.addView(View.from(v, this.factoriesManager));
      });

      r.setCombinedViews(role.combinedViewsIds);
      this.roles.set(role.name, r);
    });
  }*/

  public getRoles = (): Role[] => Array.from(this.roles.values());

  public onRolesChange(listener: () => void) {
    return this;
  }
}
