import { SharedCell } from "@fluidframework/cell";
import { FactoriesManager } from "../managers/FactoriesManager";
import { IRole } from "./IRole";

export class Role {
  private id: string;
  private name: string;

  constructor(
    protected readonly sharedRole: SharedCell,
    protected readonly factoriesManager: FactoriesManager
  ) {
    this.id = "";
    this.name = "";
    this.loadObject();
    this.setEventListener();
  }

  private setEventListener() {
    this.sharedRole.on("valueChanged", (e: any) => {
      this.loadObject();
    });
  }

  public loadObject() {
    const role = this.sharedRole.get() as IRole;
    this.id = role.id;
    this.name = role.name;
  }

  /* GETTERS */
  public getObject(): IRole {
    return this.sharedRole.get();
  }

  public getSharedObject(): SharedCell {
    return this.sharedRole;
  }

  public getName(): string {
    return this.name;
  }

  public getId(): string {
    return this.id;
  }

  public updateName(newName: string) {
    this.sharedRole.set({ ...this.getObject(), name: newName });
  }

  public toRole(): IRole {
    return {
      name: this.name,
      id: this.id,
    };
  }
}
