import EventEmitter from "events";

export class Logger extends EventEmitter {
  logs: Log[];

  private static _instance: Logger = new Logger();

  constructor() {
    super();
    this.logs = [];

    if (Logger._instance) {
      throw new Error(
        "Error: Instantiation failed: Use SingletonClass.getInstance() instead of new."
      );
    }
    Logger._instance = this;
  }

  public static getInstance(): Logger {
    return Logger._instance;
  }

  public info(str: string) {
    this.logs.push({
      type: "info",
      value: str,
      date: new Date().toLocaleString(),
    });
  }

  public warning(str: string) {
    this.logs.push({
      type: "warning",
      value: str,
      date: new Date().toLocaleString(),
    });
  }

  public error(str: string) {
    this.logs.push({
      type: "error",
      value: str,
      date: new Date().toLocaleString(),
    });
  }

  public getLogs(): Log[] {
    return this.logs;
  }
}

export interface Log {
  date: string;
  type: string;
  value: string;
}
