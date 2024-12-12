import { getLogger as _getLogger, type Logger as _Logger } from "jsr:@std/log";

export type Logger = _Logger & { getLogger: (name: string) => Logger };

/**
 * A small wrapper around the std/log module that adds a getLogger method to the logger object.
 * The getLogger method returns a new logger with the given name as a prefix, which is useful for
 * "nested loggers" that can be used to distinguish between different parts of the codebase.
 * @param name the name of the logger
 */
export function getLogger(name: string): Logger {
  const logger = _getLogger(name);
  (["info", "warn", "error", "debug"] as const).forEach((level) => {
    logger[level] = logger[level].bind(logger);
  });
  const getSublogger = (subName: string) => getLogger(`${name}:${subName}`);
  return Object.assign(logger, { getLogger: getSublogger });
}
