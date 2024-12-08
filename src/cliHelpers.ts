import * as cli from "jsr:@std/cli";
import { ConsoleHandler, setup as setupLogger } from "jsr:@std/log";

/**
 * A structure that describes a flag that can be passed to a CLI program.
 */
export interface FlagSpecification {
  name: string;
  alias: string[];
  type: "boolean" | "string";
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
      acc[type].push(name);
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

  const thisFileName = new URL(importMetaUrl).pathname.split("/").pop();

  const printVersion = (printFn: (message: string) => void = console.log) => {
    printFn(version + "");
    Deno.exit(0);
  };

  /**
   * Outputs the help text and exits
   */
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
