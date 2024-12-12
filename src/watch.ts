/**
 * Watches a directory
 * @param fsRoot the root to watch
 * @param onFileChanged a function to run when anything changes
 */
export async function watch(
  fsRoot: string,
  onFileChanged: (file: string) => void
) {
  const notifiers = new Map<string, number>();
  const watcher = Deno.watchFs(fsRoot);

  for await (const event of watcher) {
    if (["any", "access"].includes(event.kind)) {
      continue;
    }

    const dataString = JSON.stringify(event.paths);

    if (notifiers.has(dataString)) {
      clearTimeout(notifiers.get(dataString));
      notifiers.delete(dataString);
    }
    notifiers.set(
      dataString,
      setTimeout(() => {
        notifiers.delete(dataString);
        onFileChanged(event.paths[0]);
      }, 20)
    );
  }
}
