/* eslint-disable no-invalid-this */
/* eslint-disable valid-jsdoc */

import { Role } from "../roles/Role";
import { SharedMap } from "@fluidframework/map";
import { FactoriesManager } from "./FactoriesManager";
import { SharedCell } from "@fluidframework/cell";
import EventEmitter from "events";

enum RolesManagerEvents {
  ChangeState = "changeState",
}
/* This class is responsible for controlling assigning the roles to the devices */
export class RolesManager extends EventEmitter {
  private roles: Map<string, Role>;
  private lastCommit: number;

  constructor(
    readonly rolesMap: SharedMap,
    readonly factoriesManager: FactoriesManager
  ) {
    super();
    this.roles = new Map<string, Role>();
    this.setEventListener();
    this.lastCommit = 0;
  }

  /* Defines the event listeners needed */
  private setEventListener() {
    this.rolesMap.on("valueChanged", async () => {
      this.lastCommit++;
      await this.loadRoles(this.lastCommit);
      this.emitChange();
    });
  }

  /*
   * Loads all the roles from the shares roles map
   */
  public async loadRoles(commit: number) {
    const promises = [];
    for (const handle of this.rolesMap.values()) {
      promises.push(handle.get());
    }

    const roles = await Promise.all(promises);

    if (this.lastCommit > commit) return;

    const newRoles = new Map<string, Role>();

    roles.forEach((role) => {
      if (role) {
        const r = this.loadRole(role);
        if (r) {
          newRoles.set(r.getId(), r);
        }
      }
    });

    this.roles = newRoles;
    console.log("" + this.roles.size + " Roles loaded.");
  }

  /*
   * Loads a role from a shared role, if it exists it updates , otherwise
   * creates a new role
   */
  public loadRole(sharedRole: SharedCell): Role {
    const sharedRoleValue = sharedRole.get();
    let role: Role;
    if (this.roles.has(sharedRoleValue.id)) {
      role = this.roles.get(sharedRoleValue.id);
      role.loadObject();
    } else {
      role = new Role(sharedRole, this.factoriesManager);
      this.roles.set(role.getId(), role);
    }

    function change() {
      this.emitChange(
        "Role " + sharedRoleValue.name + " changed so changing state"
      );
    }

    sharedRole.off("valueChanged", change);
    sharedRole.on("valueChanged", change);

    return role;
  }

  /* GETTERS */
  /*
   * Gets a role by the name
   */
  public getRole(roleId: string): Role {
    return this.roles.get(roleId);
  }

  public getRoleByName(roleName: string): Role {
    return Array.from(this.roles.values()).find(
      (role) => role.getName() === roleName
    );
  }

  /*
   * Gets a roles
   */
  public getRoles = (): IterableIterator<Role> => this.roles.values();

  /*
   * Check if the role exists
   */
  public hasRole(roleId: string): boolean {
    return this.roles.has(roleId);
  }

  /*
   * Renames a role
   */
  public renameRole(id: string, oldRoleName: string, newRoleName: string) {
    if (oldRoleName === newRoleName) return;
    const role = this.roles.get(id);
    if (!role) return;
    const cell = role.getSharedObject();
    cell.set({ ...cell.get(), name: newRoleName });
  }

  /*
   * Adds a role to the roles map and roles shared map
   */
  public addRole(sharedRole: SharedCell): Role {
    const sharedRoleValue = sharedRole.get();

    if (this.rolesMap.has(sharedRoleValue.id)) {
      console.error("The role " + sharedRoleValue.id + " already exists.");
      return;
    }
    console.log("Adding role " + sharedRoleValue.id);
    this.rolesMap.set(sharedRoleValue.id, sharedRole.handle);
    console.log(this.roles.keys());
    const role = new Role(sharedRole, this.factoriesManager);
    this.roles.set(sharedRoleValue.id, role);

    return role;
  }

  public deleteRolesEventListener() {
    //const values = this.roles.values();
    //for (const v of values) {
    //v.deleteAllViewsListeners();
    //}
  }

  /*
   * Removes a role to the roles map and roles shared map
   */
  public removeRole(roleId: string): void {
    this.roles.delete(roleId);
    this.rolesMap.delete(roleId);
  }

  /* Callback functions */

  private emitChange(message?: string) {
    this.emit(RolesManagerEvents.ChangeState, message);
  }
}
