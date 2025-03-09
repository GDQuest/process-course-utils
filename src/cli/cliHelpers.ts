import { resolve } from "jsr:@std/path@^1.0.7/resolve";
import * as cli from "jsr:@std/cli";
import { ConsoleHandler, LogRecord, setup as setupLogger } from "jsr:@std/log";

/**
 * A structure that describes a flag that can be passed to a CLI program.
 */
export interface FlagSpecification {
  /* The default name of the flag. This is what you'll use in JS, so you probably want it to be camelCase */
  name: string;
  /* The aliases for the flag. The first one is the short version, the second one is the long version. If the longer version
   * is not supplied, `name` is used.
   */
  alias: [string, string] | [string] | [];
  /* The type of the flag. This can be one of three values:
   * - "boolean": The flag is a boolean flag. It can be passed or not passed. If passed, it is `true`, otherwise it is `false`.
   * - "string": The flag is a string flag. It must be passed with a value, e.g. `--flag value`.
   * - "path": The flag is a path flag. It must be passed with a value, which is resolved to an absolute path.
   */
  type: "boolean" | "string" | "path";
  /* A description of the flag. This is used in the help text. */
  description: string;
}

export interface FlagsSeparator {
  type: "separator";
  description: string;
}

export type FlagsSpecificationList = (FlagSpecification | FlagsSeparator)[];

/**
 * A list of flag specifications that are always present in every CLI program.
 */
const alwaysPresentFlags = [
  {
    name: "help",
    alias: ["h"],
    type: "boolean",
    description: "Show this help message and exit",
  },
  {
    name: "version",
    alias: ["v"],
    type: "boolean",
    description: "Show version number and exit",
  },
] as FlagSpecification[];

/**
 * Builds the options object that is passed to Deno's `cli.parseArgs`.
 */
function buildParseOptions<
  TDefault extends Record<string, string | boolean> | undefined = Record<
    string,
    string | boolean
  >
>(flagsSpecifications: FlagsSpecificationList, default_options: TDefault) {
  return flagsSpecifications.reduce(
    (acc, spec) => {
      if (spec.type === "separator") {
        return acc;
      }
      const { name, alias, type } = spec;
      acc.alias[name] = alias;
      if (type === "path") {
        acc.string.push(name);
      } else {
        acc[type].push(name);
      }
      return acc;
    },
    {
      alias: {} as Record<string, string[]>,
      boolean: [] as string[],
      string: [] as string[],
      flagsSpecifications,
      default: default_options,
    }
  );
}

/**
 * Options for the `parseFlags` function.
 */
interface ParseFlagsOptions<
  TDefault extends Record<string, string | boolean> | undefined = Record<
    string,
    string | boolean
  >
> {
  /** The version of the CLI program. Used when `--version` is passed. */
  version: string | number;
  /** The name of the CLI program. Used for the help text */
  name: string;
  /** The URL of the current module. Used for the help text */
  importMetaUrl: string;
  /** A description of the CLI program. Used for the help text */
  description: string;
  /** The flag specifications for the CLI program */
  spec: FlagsSpecificationList;
  /** The default options for the CLI, if none are passed. This is passed as-is to Deno's `cli.parseArgs` */
  default: TDefault;
  /** The arguments string to parse (e.g, `Deno.args`) */
  args: string[];
}

/**
 * Returns a set of flags parsed from the command line arguments, with some utility functions to print help, version, etc.
 * All paths marked as `path` in the spec are resolved to absolute paths, no need to resolve them manually.
 * 
 * You do not have to provide a spec for all flags. Flags without a spec will still be collected, but they won't show in the help text.
 * @param options
 */
export function parseFlags<
  T extends Record<string, string | boolean> = Record<string, string | boolean>
>({
  version,
  name,
  importMetaUrl,
  description,
  spec: specRaw,
  default: defaultOptions,
  args,
}: ParseFlagsOptions) {
  const spec = [...alwaysPresentFlags, ...specRaw];

  const parseOptions = buildParseOptions(spec, defaultOptions);
  /** the parsed final flags */
  const flags = cli.parseArgs(args, parseOptions) as T;

  const cwd = Deno.cwd();

  // resolve all paths:
  spec.forEach((spec) => {
    if (spec.type === "path") {
      const name = spec.name as keyof T;
      const resolvedPath = resolve(cwd, flags[name] as string);
      // deno-lint-ignore no-explicit-any
      flags[name] = resolvedPath as any;
      spec.alias.forEach((a: keyof T) => {
        // deno-lint-ignore no-explicit-any
        flags[a] = resolvedPath as any;
      });
    }
  });

  const thisFileName = new URL(importMetaUrl).pathname.split("/").pop();

  const printVersion = (printFn: (message: string) => void = console.log) => {
    printFn(version + "");
    Deno.exit(0);
  };

  const printDefaults = (printFn: (message: string) => void = console.log) => {
    Object.entries(defaultOptions).forEach(([key, value]) => {
      printFn(`${key}: ${value}`);
    });
  };

  const printValues = (printFn: (message: string) => void = console.log) => {
    Object.entries(defaultOptions).forEach(([key, value]) => {
      printFn(`${key}: ${flags[key] ?? value}`);
    });
  };

  const printHelp = (printFn: (message: string) => void = console.log) => {
    printFn(`Usage: ${thisFileName} [OPTIONS]`);
    printFn(`${name} version ${version}`);
    printFn(``);
    if (description) {
      printFn(description);
      printFn(``);
    }
    printFn(`Options:`);
    let longest = 0;
    const lines = spec.map((spec) => {
      if (spec.type === "separator") {
        return { commands: "", description: spec.description };
      }
      const { name, alias, description } = spec;
      const commands =
        alias.length === 0
          ? `--${name}`
          : alias.length === 1
          ? alias[0].length === 1
            ? `-${alias[0]}, --${name}`
            : `--${alias[0]}`
          : `-${alias[0]}, --${alias[1]}`;
      longest = Math.min(Math.max(longest, commands.length), 50);
      return { commands, description };
    });
    lines.forEach(({ commands, description }) => {
      if (commands === "") {
        printFn(``);
        printFn(`${description}`);
      } else {
        printFn(`  ${commands.padEnd(longest, " ")}  ${description}`);
      }
    });
    printFn(``);
  };

  return {
    flags,
    printHelp,
    printVersion,
    printDefaults,
    printValues,
  } as const;
}

const levelIcons: Record<LogRecord["levelName"], string> = {
  DEBUG: "-",
  INFO: "ℹ️",
  WARN: "⚠️",
  ERROR: "❌",
  CRITICAL: "🆘",
  TIME: "⏱️",
} as const;

export function enableConsoleLogging(...names: string[]) {
  setupLogger({
    handlers: {
      console: new ConsoleHandler("DEBUG", {
        formatter(logRecord) {
          const { levelName, loggerName, args, msg } = logRecord;
          if(msg === "timeLog" && args && args.length && args[0] != null && typeof args[0] === "object" && 'duration' in args[0] && typeof args[0].duration === "number" && 'name' in args[0] && typeof args[0].name === "string") {
            const name = args[0].name;
            if('start' in args[0] && args[0].start === true) {
              return `${levelIcons.TIME} [${loggerName}][${name}] started`;
            }
            const duration = (args[0].duration / 1000).toFixed(3);
            return `${levelIcons.TIME} [${loggerName}][${name}] took ${duration}s`;
          }
          return (
            `${levelIcons[levelName]} [${loggerName}] ${msg}` +
            (args && args.length ? `${JSON.stringify(args, null, 2)}` : "")
          );
        },
      }),
    },
    loggers: Object.fromEntries(
      names.map((name) => [name, { level: "DEBUG", handlers: ["console"] }])
    ),
  });
}
