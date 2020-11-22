import { Logger } from "tslog";


let logger: Logger;

export function getLoggerInstance() {
  if (!logger) {
    logger = new Logger({ name: "APILogger" });
  }

  return logger;
}
