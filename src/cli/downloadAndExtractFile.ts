import { ZipReaderStream } from "jsr:@zip-js/zip-js";
import { ensureDir, ensureFile} from "jsr:@std/fs";
import { resolve } from "jsr:@std/path";

/**
 * Downloads and extracts a file from a zip archive found at the given URL.
 * @param fileDownloadUrl the URL to download the file from
 * @param destination the directory to extract the file to
 */
export async function downloadAndExtractFile(
  fileDownloadUrl: string,
  destination: string = "./",
) {
  const response = await fetch(fileDownloadUrl);
  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }
  if (response.body == null) {
    throw new Error("Response body is null or empty");
  }
  const reader = response.body.pipeThrough(new ZipReaderStream());
  for await (const entry of reader) {
    const fullPath = resolve(destination, entry.filename);
    if (entry.directory) {
      await ensureDir(fullPath);
    } else {
      await ensureFile(fullPath);
      await entry.readable?.pipeTo((await Deno.create(fullPath)).writable);
    }
  }
}
