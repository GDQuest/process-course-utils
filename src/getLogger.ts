import { getLogger as _getLogger } from "jsr:@std/log";

export function getLogger(name: string) {
  const logger = _getLogger(name);
  const [info, warn, error, debug] = (
    ["info", "warn", "error", "debug"] as const
  ).map((level) => logger[level].bind(logger));
  const getSubLogger = (subName: string) => getLogger(`${name}:${subName}`);
  return { info, warn, error, debug, getLogger: getSubLogger };
}
