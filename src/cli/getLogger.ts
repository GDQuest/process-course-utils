import { getLogger as _getLogger, Logger, LogLevels } from "jsr:@std/log";
import { startMeasuringTime } from "./measureTime.ts";

declare module "jsr:@std/log" {
  interface Logger{
    measureTime: (name: string) => () => void;
    getLogger: (name: string) => Logger;
  }
}

Logger.prototype.measureTime = function loggerTime(this: Logger, name: string, showStart = true) {
  if (this.level > LogLevels.INFO) {
    return () => {}
  }
  if(showStart){
    this.info("timeLog", { name, start: true, duration: 0 })
  }
  const end = startMeasuringTime(name);
  return () => {
    
    const duration = end();

    this.info("timeLog", { end: true, name, duration })
  }
}

/**
 * A small wrapper around the std/log module that adds a getLogger method to the logger object.
 * The getLogger method returns a new logger with the given name as a prefix, which is useful for
 * "nested loggers" that can be used to distinguish between different parts of the codebase.
 * @param name the name of the logger
 */
export const getLogger = (name: string) => {
  const logger = _getLogger(name);
  logger.info = logger.info.bind(logger);
  logger.error = logger.error.bind(logger);
  logger.warn = logger.warn.bind(logger);
  logger.debug = logger.debug.bind(logger);
  logger.measureTime = logger.measureTime.bind(logger);
  logger.getLogger = (subName: string) => getLogger(`${name}:${subName}`)
  return logger
}

export { Logger, LogLevels}