import { join } from "jsr:@std/path";
import { downloadAndExtractFile } from "./downloadAndExtractFile.ts";

/**
 * Ensures the binary exists at the expected path, downloading it if it doesn't.
 * @param expectedBinaryPath The expected path of the binary
 * @param binaryDownloadURL The URL to download the binary from if not found
 * @param dryRun Skip downloading the binary
 */
export async function ensureBinaryExistsOrDownload(
  expectedBinaryPath: string,
  binaryDownloadURL: string,
  dryRun: boolean,
  printFn: (message: string) => void,
  printErr: (message: string) => void
) {
  try {
    await Deno.stat(expectedBinaryPath);
    await ensureBinaryIsExecutable(expectedBinaryPath, printErr);
    if (dryRun) {
      printFn(`Binary found at ${expectedBinaryPath}`);
    }
  } catch {
    const binaryDir = join(expectedBinaryPath, "..");
    if (dryRun) {
      printFn(
        `Would download binary from ${binaryDownloadURL} to ${binaryDir}`
      );
    } else {
      printFn(`Downloading and unzipping ${binaryDownloadURL} to ${binaryDir}`);
      await downloadAndExtractFile(binaryDownloadURL, binaryDir);
      await ensureBinaryIsExecutable(expectedBinaryPath, printErr);
    }
  }
}

async function ensureBinaryIsExecutable(
  binaryPath: string,
  printErr: (message: string) => void
) {
  try {
    await Deno.chmod(binaryPath, 0o755);
  } catch (error) {
    printErr(`Error setting executable permissions on ${binaryPath}: ${error}`);
  }
}
