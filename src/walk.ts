import {
  join,
  fromFileUrl,
  normalize,
  basename as getBasename,
  extname,
  dirname as getDirname,
} from "jsr:@std/path";
import { type WalkOptions } from "jsr:@std/fs";

export function toPathString(pathUrl: string | URL): string {
  return pathUrl instanceof URL ? fromFileUrl(pathUrl) : pathUrl;
}

function shouldInclude(
  path: string,
  exts?: string[],
  match?: RegExp[],
  skip?: RegExp[]
): boolean {
  if (exts && !exts.some((ext): boolean => path.endsWith(ext))) {
    return false;
  }
  if (match && !match.some((pattern): boolean => !!path.match(pattern))) {
    return false;
  }
  if (skip && skip.some((pattern): boolean => !!path.match(pattern))) {
    return false;
  }
  return true;
}

async function walkEntryFromPath(
  path: string | URL | WalkEntry
): Promise<WalkEntry> {
  if (typeof path === "object") {
    return path as WalkEntry;
  }
  path = toPathString(path);
  path = normalize(path);
  const name = getBasename(path);
  const stat = await Deno.stat(path);
  if (stat.isDirectory) {
    return {
      path,
      name,
      isFile: stat.isFile,
      isDirectory: stat.isDirectory,
      isSymlink: stat.isSymlink,
      files: [],
      directories: [],
      realPath: await Deno.realPath(path),
    };
  }
  const ext = extname(name);
  const extension = ext.toLowerCase() as `.${string}`;
  const dirname = getDirname(path);
  const basename = getBasename(name, ext);
  return {
    path,
    name,
    dirname,
    extension,
    basename,
    isFile: stat.isFile,
    isDirectory: stat.isDirectory,
    isSymlink: stat.isSymlink,
    realPath: await Deno.realPath(path),
  };
}

/**
 * Common properties of walk entries.
 */
type WalkEntryBase = Deno.DirEntry & {
  /** The path of the entry. */
  path: string;
  /** The real path of the entry. Equivalent for most files, but is different for Symlinks */
  realPath: string;
};

/** A file walk entry. */
export type FileWalkEntry = WalkEntryBase & {
  /** The extension of the file. Always lowercase, and includes the initial dot. */
  extension: `.${string}`;
  /** The basename of the file. */
  basename: string;
  /** The directory name of the file. */
  dirname: string;
  isDirectory: false;
};

/** A directory walk entry. */
export type DirWalkEntry = WalkEntryBase & {
  isDirectory: true;
  /** The files in the directory. */
  files: FileWalkEntry[];
  /** The directories in the directory. */
  directories: DirWalkEntry[];
};

/** A walk entry that is either a file or a directory. */
export type WalkEntry = FileWalkEntry | DirWalkEntry;

/**
 * Resolved options for the walk function, with defaults filled in.
 */
export type WalkOptionsRequired = WalkOptions &
  Required<
    Pick<
      WalkOptions,
      | "maxDepth"
      | "includeFiles"
      | "includeDirs"
      | "includeSymlinks"
      | "followSymlinks"
      | "canonicalize"
    >
  >;

/**
 *
 * Deno's [`walk`](https://jsr.io/@std/fs/doc/~/walk) function is nice, but it can't be short-circuited.
 *
 * This function keeps feature parity and the same API, but uses a functor instead of a generator.
 *
 * A few important distinctions:
 * 1. the functor will **not** automatically recurse into directories.To recurse, call the provided `process()` function in the functor.
 * 2. `maxDepth` is not respected. The value does get decremented, but it is up to the functor to respect it.
 * 3. The returned `WalkEntry` objects have a `realPath` property that is the resolved path of the entry.
 *    If you want to follow symlinks, you should always use `realPath`, which resolves correctly for all entry types.
 * 4. `canonicalize` is always `true`. This is because the `realPath` is always needed to determine if a symlink is a directory or file.
 *
 */
export async function walk<T>(
  root: string | URL,
  options: WalkOptions = {},
  functor: (
    entry: WalkEntryBase,
    options: WalkOptionsRequired & {
      process: (entry: WalkEntry) => Promise<void>;
    }
  ) => void | Promise<void>
): Promise<void> {
  const {
    maxDepth = Infinity,
    includeFiles = true,
    includeDirs = true,
    includeSymlinks = true,
    followSymlinks = false,
    canonicalize = true,
    match = undefined,
    skip = undefined,
  } = options;

  root = toPathString(root);

  const exts = options?.exts?.map((ext) =>
    ext.startsWith(".") ? ext : `.${ext}`
  );

  const opts = {
    maxDepth,
    includeFiles,
    includeDirs,
    includeSymlinks,
    followSymlinks,
    canonicalize,
    match,
    skip,
    exts,
  };

  const functorWrapper = async (
    entry: WalkEntryBase,
    options: WalkOptionsRequired
  ) => {
    const process = bindedWalk.bind(null, options);
    await functor(entry, { ...options, process });
  };

  const bindedWalk = _walk.bind(null, functorWrapper);

  await bindedWalk(opts, root);
}

async function _walk(
  processEntry: (
    entry: WalkEntry,
    options: WalkOptionsRequired
  ) => Promise<void>,
  options: WalkOptionsRequired,
  root: string | WalkEntry
) {
  const rootWalkEntry = await walkEntryFromPath(root);

  const {
    maxDepth,
    includeFiles,
    includeDirs,
    includeSymlinks,
    followSymlinks,
    match,
    skip,
    exts,
  } = options;

  if (!shouldInclude(rootWalkEntry.path, exts, match, skip)) {
    return;
  }

  if (rootWalkEntry.isDirectory) {
    if (!includeDirs) {
      return;
    }

    for await (const dirEntry of Deno.readDir(rootWalkEntry.realPath)) {
      const path = join(rootWalkEntry.path, dirEntry.name);
      const childWalkEntry = await walkEntryFromPath(path);
      if (childWalkEntry.isSymlink && !includeSymlinks) {
        continue;
      }
      if (
        childWalkEntry.isDirectory &&
        includeDirs &&
        shouldInclude(path, undefined, match, skip)
      ) {
        rootWalkEntry.directories.push(childWalkEntry);
        continue;
      } else if (includeFiles && shouldInclude(path, exts, match, skip)) {
        rootWalkEntry.files.push(childWalkEntry as FileWalkEntry);
      }
    }
    const opts = { ...options, maxDepth: maxDepth - 1 };
    return await processEntry(rootWalkEntry, opts);
  }
  if (rootWalkEntry.isSymlink) {
    if (!includeSymlinks) {
      return;
    }
    if (followSymlinks) {
      return await _walk(processEntry, options, rootWalkEntry);
    }
    return await processEntry(rootWalkEntry, options);
  }
  if (!includeFiles) {
    return;
  }
  if (rootWalkEntry.isFile) {
    return await processEntry(rootWalkEntry, options);
  }
}
