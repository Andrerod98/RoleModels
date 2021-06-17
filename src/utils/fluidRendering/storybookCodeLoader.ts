/* !
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
  ICodeLoader,
  IProvideRuntimeFactory,
} from "@fluidframework/container-definitions";

import { IFluidCodeDetails } from "@fluidframework/core-interfaces";

export class StorybookCodeLoader implements ICodeLoader {
  private readonly factory: IProvideRuntimeFactory;

  constructor(factory: IProvideRuntimeFactory) {
    this.factory = factory;
  }

  public load(source: IFluidCodeDetails) {
    // Normally the "source" parameter would be the package details.
    return Promise.resolve({
      fluidExport: this.factory.IRuntimeFactory,
    });
  }
}
