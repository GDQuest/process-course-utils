import { WalkEntry } from "jsr:@std/fs@^1.0.5/walk";
import { SocketMessage } from "./SocketMessageTypes.ts";

export function clientSideSocketHandler() {
  if (typeof window === "undefined") {
    return;
  }

  const Win = typeof window === "undefined" ? globalThis : window;

  let reconnectionTimerId = 0;
  let socket: WebSocket | null = null;

  const requestUrl = `${Win.location.origin.replace("http", "ws")}/refresh`;

  function connect(callback = () => {}) {
    if (socket) {
      socket.close();
    }
    socket = new WebSocket(requestUrl);

    socket.addEventListener("open", callback);

    socket.addEventListener("message", ({ data }) => {
      const message = JSON.parse(data) as SocketMessage;
      if (message.type === "refresh") {
        refresh();
      } else if (message.type === "reload") {
        log(`reloading ${message.module} -- NOT IMPLEMENTED YET`);
      }
    });

    socket.addEventListener("close", () => {
      log("connection lost - reconnecting...");

      clearTimeout(reconnectionTimerId);

      reconnectionTimerId = setTimeout(() => {
        connect(refresh);
      }, 1000);
    });
  }

  function log(message = "") {
    console.info("[refresh] ", message);
  }

  function refresh() {
    log("refreshing...");
    Win.location.reload();
  }

  log("connecting...");
  connect();
}
