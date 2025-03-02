/**
 * Preprocesses MDX files using the provided binary.
 * @param expectedBinaryPath The path to the binary
 * @param destinationDirectoryPath The directory to store the processed the MDX files
 * @param dryRun Skip preprocessing the MDX files
 */
export async function preprocessMdxWithBinary(
  expectedBinaryPath: string,
  destinationDirectoryPath: string,
  dryRun: boolean,
  printFn: (message: string) => void
) {
  printFn(`Preprocessing MDX files using ${expectedBinaryPath}`);
  const args = ["--dist-dir", destinationDirectoryPath];
  if (dryRun) {
    printFn(`Dry run mode - would run:`);
    printFn(`    ${expectedBinaryPath} ${args.join(" ")}`);
    return;
  }

  const command = new Deno.Command(expectedBinaryPath, { args });

  const { success, stdout, stderr } = await command.output();
  if (!success) {
    const errorOutput = new TextDecoder().decode(stderr);
    throw new Error(`Error preprocessing MDX: ${errorOutput}`);
  }

  const output = new TextDecoder().decode(stdout);
  console.log(output);

  printFn(`Preprocessing complete`);
}
