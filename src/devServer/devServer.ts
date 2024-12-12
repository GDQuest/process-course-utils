import { extname, join } from "jsr:@std/path@^1.0.7";
import { serveDir, type ServeDirOptions } from "jsr:@std/http/file-server";
import { type Logger } from "../getLogger.ts";
import { typescriptTranspile } from "../transpile.ts";
import { watch } from "../watch.ts";
import { SocketMessage } from "./SocketMessageTypes.ts";

/**
 * A in-memory socket cache that stores all the connected sockets.
 * It also provides a method to send a message to all connected sockets.
 */
const makeWebSocketUpgrader = (printFn: (msg: string) => void) => {
  const sockets: Set<WebSocket> = new Set();
  const handle = (req: Request) => {
    const { response, socket } = Deno.upgradeWebSocket(req);

    sockets.add(socket);

    // Remove the socket from our in-memory store
    // when the socket closes.
    socket.onclose = () => {
      sockets.delete(socket);
    };
    return response;
  };
  const dispatch = (message: SocketMessage) => {
    for (const socket of sockets) {
      socket.send(JSON.stringify(message));
    }
  };

  const refresh = (changedFile: string) => {
    printFn(`File changed: ${changedFile}`);
    dispatch({ type: "refresh", path: changedFile });
  };

  const onHmr = (e: Event) => {
    // not working
    printFn("HMR! " + (e as CustomEvent).detail.path);
    refresh;
  };

  addEventListener("hmr", onHmr);

  const destroy = () => removeEventListener("hmr", onHmr);

  return { handle, destroy, refresh };
};

/**
 * Compiles the client bundle used for hot reloading
 * @param url the url to serve the client script on
 */
export const makeClientScriptHandler = async (url: string) => {
  const clientScriptSrcRaw = await typescriptTranspile(
    new URL("./clientSocket.ts", import.meta.url)
  );
  if (!clientScriptSrcRaw) {
    throw new Error("Failed to transpile clientSocket.ts");
  }

  const clientScriptSrc = `(${clientScriptSrcRaw
    .replace(/^export\s+/, "")
    .replace(/^function \w+\(.*?\)\s*{/, "() => { ")
    .replace(/}[;\s]*$/, "}")})();`;

  const handle = () => {
    return new Response(clientScriptSrc, {
      headers: {
        "content-type": "application/javascript",
      },
    });
  };

  const scriptTag = `<script src="${url}"></script>`;

  return { handle, url, scriptTag };
};

const loadHtmlAndInjectScript = async (filePath: string, scriptTag: string) => {
  const fileContent = await Deno.readTextFile(filePath);
  if (!fileContent.toLowerCase().includes("<html")) {
    return fileContent;
  }
  const modifiedContent = fileContent.replace(
    /<\/body>/i,
    `${scriptTag}</body>`
  );
  return modifiedContent;
};

/**
 * Handles serving html files and injecting a script tag into them.
 * @param fsRoot
 * @param scriptTag
 * @param printFn
 * @returns
 */
const makeHtmlHandler = (
  fsRoot: string,
  scriptTag: string,
  printFn: (msg: string) => void
) => {
  const test = (url: URL) => {
    const extension = extname(url.pathname).toLowerCase();
    if (extension === "") {
      return join(fsRoot, url.pathname, "index.html");
    }
    if (extension === ".html") {
      return join(fsRoot, url.pathname);
    }
  };

  const testAndHandle = (url: URL) => {
    const filePath = test(url);
    if (filePath) {
      return handle(filePath);
    }
  };

  const handle = async (filePath: string) => {
    try {
      printFn(`Serving file: ${filePath}`);
      const content = await loadHtmlAndInjectScript(filePath, scriptTag);
      const headers = new Headers();
      headers.set("Content-Type", "text/html; charset=utf-8");

      return new Response(content, {
        status: 200,
        headers,
      });
    } catch (error) {
      printFn(
        "Error serving file: " +
          (error instanceof Error ? error.message : JSON.stringify(error))
      );
      return new Response("File Not Found", { status: 404 });
    }
  };

  return { handle, test, testAndHandle };
};

/**
 * Runs a local server to serve the files in the given directory.
 * It also injects a script tag to html pages to enable hot reloading.
 *
 * This isn't a fully featured dev server; it has minimal features specifically for our few use cases.
 * @param opts
 * @param logger
 * @returns
 */
export async function devServer(
  opts: ServeDirOptions & { fsRoot: string },
  logger: Logger
) {
  const webSocketsManager = makeWebSocketUpgrader(logger.info);
  const socketHandler = await makeClientScriptHandler("/__socket_client.js");
  const htmlHandler = makeHtmlHandler(
    opts.fsRoot,
    socketHandler.scriptTag,
    logger.info
  );
  watch(opts.fsRoot, webSocketsManager.refresh);

  const server = Deno.serve({
    onListen({ hostname, port }) {
      logger.info(`Server started at http://${hostname}:${port}`);
    },
    handler: (req) => {
      if (req.method !== "GET") {
        return new Response("Method not allowed", { status: 405 });
      }
      const url = new URL(req.url);

      if (url.pathname.endsWith(socketHandler.url)) {
        return socketHandler.handle();
      }
      if (url.pathname === "/refresh") {
        return webSocketsManager.handle(req);
      }

      const htmlResponse = htmlHandler.testAndHandle(url);

      if (htmlResponse) {
        return htmlResponse;
      }

      logger.info(`Request: ${req.url}`);
      return serveDir(req, { ...opts, showDirListing: true, quiet: true });
    },
  });
  return { server, scriptTag: socketHandler.scriptTag };
}
