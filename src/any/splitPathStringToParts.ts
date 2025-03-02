const pathRegex =
  /^(?:(?<protocol>\w+):\/)?\/*(?<dir>.+\/)?(?<filename>(?<basename>.+?)(?:\.(?<extension>\w+))?)$/;

const getFileTypeFromExtension = (extension?: string) => {
  if (extension == null) {
    return "directory";
  }
  switch (extension.toLowerCase()) {
    case "gd":
      return "gdscript";
    case "tscn":
      return "scene";
    case "png":
    case "jpg":
    case "gif":
      return "image";
    case "ini":
    case "text":
    case "yaml":
    case "txt":
      return "text";
    default:
      return "file";
  }
};

type PathParts = {
  /** Protocol, sans ://. Example values: `http`, `sftp`, `res`. Defaults to `res` (if it defaults, `incomplete` will be set to `true`) */
  protocol: string;
  /** extension, or `directory` if no extension was found. */
  fileType: Lowercase<ReturnType<typeof getFileTypeFromExtension>>;
  /** full directory path, without protocol or filename, e.g., `path/to/` */
  dirname: string[];
  /** only the filename, including extension, e.g. `file.gd` */
  filename: string;
  /** only the filename, without extension, e.g. `file` */
  basename: string;
  /** full path _without_ protocol , e.g. `path/to/file.gd` */
  fullPath: string[];
  /** full path _with_ protocol, e.g. `res://path/to/file.gd` */
  href: string[];
  /** extension of the file, without the preceeding dot, with case conserved, e.g. `gd` */
  extension: string;
  /** Is `true` if no protocol was provided and one defaulted to */
  incomplete: boolean;
};

const DEFAULT_REGEX_VALUES = {
  protocol: "",
  dir: "",
  filename: "",
  basename: "",
  extension: "",
}

export const splitPathStringToParts = (path: string) => {
  path = path.replace(/^\/+/, "");
  const {
    protocol: _protocol,
    dir,
    filename,
    basename,
    extension,
  } = path.match(pathRegex)?.groups ?? DEFAULT_REGEX_VALUES;
  const dirname = dir != null ? dir.replace(/\/+$/,'').split("/") : [];
  const incomplete = typeof _protocol === "undefined";
  const protocol = _protocol ?? "res";
  const fullPath = [dir, filename].filter(Boolean) as string[];
  const href = [protocol, ...dirname, filename].filter(Boolean) as string[];
  const fileType = getFileTypeFromExtension(extension);
  const parts: PathParts = {
    href,
    fullPath,
    dirname,
    filename,
    protocol,
    basename,
    extension,
    fileType,
    incomplete,
  };
  return parts
};