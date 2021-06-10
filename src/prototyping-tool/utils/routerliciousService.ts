/* !
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
  IDocumentServiceFactory,
  IUrlResolver,
} from "@fluidframework/driver-definitions";
import { RouterliciousDocumentServiceFactory } from "@fluidframework/routerlicious-driver";
import { InsecureTokenProvider } from "@fluidframework/test-runtime-utils";
import { IGetContainerService } from "@fluid-experimental/get-container";
import { RouterliciousUrlResolver } from "@fluidframework/routerlicious-urlresolver";

export interface IRouterliciousConfig {
  tinyliciousUrl: string;
  tinyliciousPort: number;
  tenantId: string;
  key: string;
}

export class RouterliciousService implements IGetContainerService {
  public readonly documentServiceFactory: IDocumentServiceFactory;
  public readonly urlResolver: IUrlResolver;

  constructor() {
    const user = {
      id: "unique-id",
      name: "Unique Idee",
    };
    const tokenProvider = new InsecureTokenProvider("12345", user);
    this.documentServiceFactory = new RouterliciousDocumentServiceFactory(
      tokenProvider
    );

    this.urlResolver = new RouterliciousUrlResolver(
      undefined,
      async () => Promise.resolve("http://192.168.1.105:3000"),
      "http://192.168.1.105:3000"
    );
  }
}
