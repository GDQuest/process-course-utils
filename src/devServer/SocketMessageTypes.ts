type SocketMessageRefresh = {
  type: "refresh";
  path: string;
};

type SocketMessageModuleChanged = {
  type: "reload";
  module: string;
};

export type SocketMessage = SocketMessageRefresh | SocketMessageModuleChanged;
