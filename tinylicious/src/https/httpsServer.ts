/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as https from "https";
import * as http from "http";
import { AddressInfo } from "net";
import * as util from "util";
import fs from "fs";
import path from "path";
import {
  IHttpsServer,
  IWebServer,
  IWebServerFactory,
  IWebSocketServer
} from "./https";
import * as socketIo from "./socketIoServer";

const keyPath = path.join(__dirname, "../../../certificates/host.key");
const privateKey = fs.readFileSync(keyPath, "utf8");
const certPath = path.join(__dirname, "../../../certificates/host.crt");
const certificate = fs.readFileSync(certPath, "utf8");

export type RequestListener = (
  request: http.IncomingMessage,
  response: http.ServerResponse
) => void;

export class HttpsServer implements IHttpsServer {
  constructor(private readonly server: https.Server) {}

  public async close(): Promise<void> {
    await util.promisify(((callback) => this.server.close(callback)) as any)();
  }

  public listen(port: any) {
    this.server.listen(port);
  }

  public on(event: string, listener: (...args: any[]) => void) {
    this.server.on(event, listener);
  }

  public address(): AddressInfo {
    return this.server.address() as AddressInfo;
  }
}

export class WebServer implements IWebServer {
  constructor(
    public httpsServer: HttpsServer,
    public webSocketServer: IWebSocketServer
  ) {}

  /**
   * Closes the web server
   */
  public async close(): Promise<void> {
    await Promise.all([
      this.httpsServer.close(),
      this.webSocketServer ? this.webSocketServer.close() : Promise.resolve()
    ]);
  }
}

export class SocketIoWebServerFactory implements IWebServerFactory {
  constructor(private readonly redisConfig: any) {}

  public create(requestListener: RequestListener): IWebServer {
    // Create the base HTTP server and register the provided request listener
    const credentials = { key: privateKey, cert: certificate };
    const server = https.createServer(credentials, requestListener);
    const httpsServer = new HttpsServer(server);

    const socketIoServer = socketIo.create(this.redisConfig, server);

    return new WebServer(httpsServer, socketIoServer);
  }
}

export class BasicWebServerFactory implements IWebServerFactory {
  public create(requestListener: RequestListener): IWebServer {
    // Create the base HTTP server and register the provided request listener
    const credentials = { key: privateKey, cert: certificate };
    const server = https.createServer(credentials, requestListener);
    const httpsServer = new HttpsServer(server);

    return new WebServer(httpsServer, null);
  }
}
