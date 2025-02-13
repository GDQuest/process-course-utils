import {
  join,
  fromFileUrl,
  normalize,
  basename as getBasename,
  extname,
  dirname as getDirname,
  relative as getRelative,
} from "jsr:@std/path";

export function toPathString(pathUrl: string | URL): string {
  return pathUrl instanceof URL ? fromFileUrl(pathUrl) : pathUrl;
}

export async function getFileInfo(
  path: string | URL | WalkEntry,
  rootPath: string | URL = Deno.cwd()
): Promise<WalkEntry> {
  if (typeof path === "object") {
    return path as WalkEntry;
  }
  path = toPathString(path);
  path = normalize(path);

  rootPath = toPathString(rootPath);
  rootPath = normalize(rootPath);

  const name = getBasename(path);
  const stat = await Deno.stat(path);
  const relativePath = getRelative(rootPath, path);
  const pathParts = relativePath.split("/");

  const common = {
    path,
    name,
    relativePath,
    pathParts,
    isFile: stat.isFile,
    isDirectory: stat.isDirectory,
    isSymlink: stat.isSymlink,
    realPath: await Deno.realPath(path),
    birthtime: stat.birthtime,
    ctime: stat.ctime,
    mtime: stat.mtime
  };

  if (stat.isDirectory) {
    return {
      ...common,
      isDirectory: true,
      files: [],
      directories: [],
      nodes: [],
    };
  }
  const ext = extname(name);
  const extension = ext.toLowerCase() as `.${string}`;
  const dirname = getDirname(path);
  const basename = getBasename(name, ext);
  return {
    ...common,
    isDirectory: false,
    path,
    name,
    dirname,
    extension,
    basename,
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
  relativePath: string;
  pathParts: string[];
  ctime: Date | null;
  mtime: Date | null;
  birthtime: Date | null;
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
  nodes: WalkEntry[];
};

/** A walk entry that is either a file or a directory. */
export type WalkEntry = FileWalkEntry | DirWalkEntry;

/**
 * Resolved options for the walk function, with defaults filled in.
 */
export type WalkOptions = {
  /**
   * The maximum depth of the file tree to be walked recursively.
   *
   * @default {Infinity}
   */
  maxDepth: number;
  /**
   * Indicates whether symlinks should be resolved or not.
   *
   * @default {false}
   */
  followSymlinks: boolean;

  root: string;
};

type InternalProcessor = (
  entry: WalkEntry,
  options: WalkOptions
) => Promise<void>;

/**
 *
 * Deno's [`walk`](https://jsr.io/@std/fs/doc/~/walk) function is nice, but it can't be short-circuited.
 *
 * The functor will **not** automatically recurse into directories.
 *
 */
export async function walk<T>(
  root: string | URL,
  options: Partial<Omit<WalkOptions, "root">> = {},
  functor: (
    entry: WalkEntry,
    options: WalkOptions
  ) => void | WalkEntry[] | Promise<void | WalkEntry[]>
): Promise<void> {
  const { maxDepth = Infinity, followSymlinks = false } = options;

  root = toPathString(root);

  const functorWrapper = async (entry: WalkEntry, options: WalkOptions) => {
    const files = await functor(entry, options);
    if (files) {
      await Promise.all(files.map(walker));
    }
  };

  const rootWalkEntry = await getFileInfo(root, root);

  const opts = { maxDepth, followSymlinks, root };

  const walker = _walk.bind(null, functorWrapper, opts);

  if (!rootWalkEntry.isDirectory) {
    throw new Error(`Root entry is not a directory: ${root}`);
  }
  await _readDirIntoWalkEntry(rootWalkEntry, opts);
  await Promise.all(
    [...rootWalkEntry.files, ...rootWalkEntry.directories].map(walker)
  );
  return;
}

async function _walk(
  processEntry: InternalProcessor,
  options: WalkOptions,
  entry: WalkEntry
) {
  if (
    entry.isDirectory ||
    (entry.isSymlink && options.followSymlinks && entry.isDirectory)
  ) {
    const opts = { ...options, maxDepth: options.maxDepth - 1 };
    await _readDirIntoWalkEntry(entry, opts);
  }
  return await processEntry(entry, options);
}

async function _readDirIntoWalkEntry(
  entry: DirWalkEntry,
  options: WalkOptions
): Promise<void> {
  for await (const dirEntry of Deno.readDir(entry.realPath)) {
    const path = join(entry.path, dirEntry.name);
    const childWalkEntry = await getFileInfo(path, options.root);

    if (childWalkEntry.isDirectory) {
      entry.directories.push(childWalkEntry);
    } else {
      entry.files.push(childWalkEntry as FileWalkEntry);
    }
    entry.nodes.push(childWalkEntry);
  }
}
