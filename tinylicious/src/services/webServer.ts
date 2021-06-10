/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { IWebServer, IWebSocketServer } from "../https/https";
import { HttpsServer } from "../https/httpsServer";

export class WebServer implements IWebServer {
  constructor(
    public httpsServer: HttpsServer,
    public webSocketServer: IWebSocketServer
  ) {}

  public async close(): Promise<void> {
    await Promise.all([this.httpsServer.close(), this.webSocketServer.close()]);
  }
}
