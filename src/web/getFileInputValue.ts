export const empty_files: File[] = [];

export interface HTMLInputElementFile extends HTMLInputElement {
  type: "file";
  files: FileList;
}

export interface HTMLInputElementFileMultiple extends HTMLInputElementFile {
  multiple: true;
}

export interface HTMLInputElementFileSingle extends HTMLInputElementFile {
  multiple: false;
}

export type HTMLInputElementFileAny =
  | HTMLInputElementFileMultiple
  | HTMLInputElementFileSingle;

interface inputValueGetter {
  (input: HTMLInputElementFileSingle): File | null;
  (input: HTMLInputElementFileMultiple): File[] | null;
  (input: HTMLInputElementFileAny): File | File[] | null;
}

/**
 * extract files from the input. Returns a single file if the input doesn't have the 'multiple' flag.
 * Returns null if no files were found
 */
export const getFileInputValue = ((input) => {
  const { multiple, files } = input;
  if (files && files.length) {
    if (multiple) {
      const _files = Array.from(files);
      return _files;
    }
    return files[0];
  }
  return null;
}) as inputValueGetter;
