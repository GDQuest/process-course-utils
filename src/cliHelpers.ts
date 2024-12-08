import { resolve } from "jsr:@std/path@^1.0.7/resolve";
import * as cli from "jsr:@std/cli";
import { ConsoleHandler, setup as setupLogger } from "jsr:@std/log";

/**
 * A structure that describes a flag that can be passed to a CLI program.
 */
export interface FlagSpecification {
  /* The default name of the flag. This is what you'll use in JS, so you probably want it to be camelCase */
  name: string;
  /* The aliases for the flag. The first one is the short version, the second one is the long version. If the longer version
   * is not supplied, `name` is used.
   */
  alias: [string, string] | [string];
  /* The type of the flag. This can be one of three values:
   * - "boolean": The flag is a boolean flag. It can be passed or not passed. If passed, it is `true`, otherwise it is `false`.
   * - "string": The flag is a string flag. It must be passed with a value, e.g. `--flag value`.
   * - "path": The flag is a path flag. It must be passed with a value, which is resolved to an absolute path.
   */
  type: "boolean" | "string" | "path";
  /* A description of the flag. This is used in the help text. */
  description: string;
}

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
>(flagsSpecifications: FlagSpecification[], default_options: TDefault) {
  return [...alwaysPresentFlags, ...flagsSpecifications].reduce(
    (acc, { name, alias, type }) => {
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
  spec: FlagSpecification[];
  /** The default options for the CLI, if none are passed. This is passed as-is to Deno's `cli.parseArgs` */
  default: TDefault;
}

/**
 * Returns a set of flags parsed from the command line arguments, with some utility functions to print help, version, etc.
 * All paths marked as `path` in the spec are resolved to absolute paths, no need to resolve them manually.
 * @param options
 */
export function parseFlags<
  T extends Record<string, string | boolean> = Record<string, string | boolean>
>({
  version,
  name,
  importMetaUrl,
  description,
  spec,
  default: defaultOptions,
}: ParseFlagsOptions) {
  const parseOptions = buildParseOptions(spec, defaultOptions);
  /** the parsed final flags */
  const flags = cli.parseArgs(Deno.args, parseOptions) as T;

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
    spec.forEach(({ name, alias, description }) => {
      printFn(
        `  -${alias[0]}, --${(alias[1] || name).padEnd(15)} ${description}`
      );
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

export function enableConsoleLogging(name: string) {
  setupLogger({
    handlers: {
      console: new ConsoleHandler("DEBUG"),
    },
    loggers: {
      [name]: {
        level: "DEBUG",
        handlers: ["console"],
      },
    },
  });
}
