const MAP = {
  general: {
    "open 2d editor": { default: "ctrl+f1", mac: "opt+1" },
    "open 3d editor": { default: "ctrl+f2", mac: "opt+2" },
    "open script editor": { default: "ctrl+f3", mac: "opt+3" },
    "search help": { default: "f1", mac: "opt+space" },
    "distraction free mode": { default: "ctrl+shift+f11", mac: "cmd+ctrl+d" },
    "next tab": { default: "ctrl+tab", mac: "cmd+tab" },
    "previous tab": { default: "ctrl+shift+tab", mac: "cmd+shift+tab" },
    "filter files": { default: "ctrl+alt+p", mac: "opt+cmd+p" },
    "open scene": { default: "ctrl+o", mac: "cmd+o" },
    "close scene": { default: "ctrl+shift+w", mac: "cmd+shift+w" },
    "reopen closed scene": { default: "ctrl+shift+t", mac: "cmd+shift+t" },
    "save scene": { default: "ctrl+s", mac: "cmd+s" },
    "save scene as": { default: "ctrl+shift+s", mac: "cmd+shift+s" },
    "save all scenes": { default: "ctrl+shift+alt+s", mac: "cmd+shift+opt+s" },
    "quick open": { default: "shift+alt+o", mac: "shift+opt+o" },
    "quick open scene": { default: "ctrl+shift+o", mac: "cmd+shift+o" },
    "quick open script": { default: "ctrl+alt+o", mac: "opt+cmd+o" },
    undo: { default: "ctrl+z", mac: "cmd+z" },
    redo: { default: "ctrl+shift+z", mac: "cmd+shift+z" },
    quit: { default: "ctrl+q", mac: "cmd+q" },
    "quit to project list": { default: "ctrl+shift+q", mac: "opt+shift+q" },
    "take screenshot": { default: "ctrl+f12", mac: "cmd+f12" },
    "toggle fullscreen": { default: "shift+f11", mac: "cmd+ctrl+f" },
    play: { default: "f5", mac: "cmd+b" },
    "pause scene": { default: "f7", mac: "cmd+ctrl+y" },
    stop: { default: "f8", mac: "cmd+." },
    "play scene": { default: "f6", mac: "cmd+r" },
    "play custom scene": { default: "ctrl+shift+f5", mac: "cmd+shift+r" },
    "expand bottom panel": { default: "shift+f12" },
    "toggle filesystem bottom panel": { default: "alt+f", mac: "opt+f" },
    // extra non-Godot but useful.
    "new scene": { default: "ctrl+n", mac: "cmd+n" },
    "text add selection next": { default: "ctrl+d", mac: "cmd+d" },
    ctrl: { default: "ctrl", mac: "cmd" },
    alt: { default: "alt", mac: "opt" },
    ui_text_caret_add_modifier: {
      default: "ctrl+shift",
      mac: "cmd+shift",
    },
    ui_text_caret_add_below: { default: "down", mac: "L" },
    ui_text_caret_add_above: { default: "up", mac: "O" },
    "alt+lmb": { default: "alt+lmb", mac: "opt+lmb" },
    "alt+shift+lmb": { default: "alt+shift+lmb", mac: "opt+shift+lmb" },
    "shift+alt": { default: "shift+alt", mac: "shift+opt" },
    "ctrl+shift": { default: "ctrl+shift", mac: "cmd+shift" },
    "ctrl+lmb": { default: "ctrl+lmb", mac: "cmd+lmb" },
    "ctrl+left": { default: "ctrl+left", mac: "cmd+left" },
    "ctrl+shift+right": { default: "ctrl+shift+right", mac: "cmd+shift+right" },
    "alt+tab": { default: "alt+tab", mac: "cmd+tab" },
  },
  "2d": {
    "zoom in": { default: "ctrl+=", mac: "cmd+=" },
    "zoom out": { default: "ctrl+-", mac: "cmd+-" },
    "zoom reset": { default: "ctrl+0", mac: "cmd+0" },
    "pan view": { default: "space" },
    "select mode": { default: "q" },
    "move mode": { default: "w" },
    "rotate mode": { default: "e" },
    "scale mode": { default: "s" },
    "ruler mode": { default: "r" },
    "use smart snap": { default: "shift+s" },
    "use grid snap": { default: "shift+g" },
    "multiply grid step by 2": { default: "num*" },
    "divide grid step by 2": { default: "num/" },
    "always show grid": { default: "g" },
    "show helpers": { default: "h" },
    "show guides": { default: "y" },
    "center selection": { default: "f" },
    "frame selection": { default: "shift+f" },
    "preview canvas scale": { default: "ctrl+shift+p", mac: "cmd+shift+p" },
    "insert key": { default: "ins" },
    "insert key (existing tracks)": { default: "ctrl+ins", mac: "cmd+ins" },
    "make custom bones from nodes": {
      default: "ctrl+shift+b",
      mac: "cmd+shift+b",
    },
    "clear pose": { default: "shift+k" },
    // extra
    "mouse move": { default: "alt+lmb", mac: "opt+lmb" },
  },
  "3d": {
    "toggle freelook": { default: "shift+f" },
    "freelook left": { default: "a" },
    "freelook right": { default: "d" },
    "freelook forward": { default: "w" },
    "freelook backwards": { default: "s" },
    "freelook up": { default: "e" },
    "freelook down": { default: "q" },
    "freelook speed modifier": { default: "shift" },
    "freelook slow modifier": { default: "alt", mac: "opt" },
    "select mode": { default: "q" },
    "move mode": { default: "w" },
    "rotate mode": { default: "e" },
    "scale mode": { default: "r" },
    "use local space": { default: "t" },
    "use snap": { default: "y" },
    "snap object to floor": { default: "pgdown" },
    "top view": { default: "num7" },
    "bottom view": { default: "alt+num7", mac: "opt+num7" },
    "front view": { default: "num1" },
    "rear view": { default: "alt+num1", mac: "opt+num1" },
    "right view": { default: "num3" },
    "left view": { default: "alt+num3", mac: "opt+num3" },
    "switch perspective/orthogonal view": { default: "num5" },
    "insert animation key": { default: "k" },
    "focus origin": { default: "o" },
    "focus selection": { default: "f" },
    "align transform with view": { default: "ctrl+alt+m", mac: "opt+cmd+m" },
    "align rotation with view": { default: "ctrl+alt+f", mac: "opt+cmd+f" },
    "1 viewport": { default: "ctrl+1", mac: "cmd+1" },
    "2 viewports": { default: "ctrl+2", mac: "cmd+2" },
    "2 viewports (alt)": { default: "ctrl+alt+2", mac: "opt+cmd+2" },
    "3 viewports": { default: "ctrl+3", mac: "cmd+3" },
    "3 viewports (alt)": { default: "ctrl+alt+3", mac: "opt+cmd+3" },
    "4 viewports": { default: "ctrl+4", mac: "cmd+4" },
  },
  texteditor: {
    cut: { default: "ctrl+x", mac: "cmd+x" },
    copy: { default: "ctrl+c", mac: "cmd+c" },
    paste: { default: "ctrl+v", mac: "cmd+v" },
    "select all": { default: "ctrl+a", mac: "cmd+a" },
    find: { default: "ctrl+f", mac: "cmd+f" },
    "find next": { default: "f3", mac: "cmd+g" },
    "find previous": { default: "shift+f3", mac: "cmd+shift+g" },
    "find in files": { default: "ctrl+shift+f", mac: "cmd+shift+f" },
    replace: { default: "ctrl+r", mac: "opt+cmd+f" },
    "replace in files": { default: "ctrl+shift+r", mac: "cmd+shift+r" },
    undo: { default: "ctrl+z", mac: "cmd+z" },
    redo: { default: "ctrl+y", mac: "cmd+y" },
    "move up": { default: "alt+up", mac: "opt+up" },
    "move down": { default: "alt+down", mac: "opt+down" },
    "delete line": { default: "ctrl+shift+k", mac: "cmd+shift+k" },
    "toggle comment": { default: "ctrl+k", mac: "cmd+k" },
    "fold/unfold line": { default: "alt+f", mac: "ctrl+cmd+f" },
    "duplicate selection": { default: "ctrl+shift+d", mac: "cmd+shift+c" },
    "complete symbol": { default: "ctrl+space" },
    "evaluate selection": { default: "ctrl+shift+e", mac: "cmd+shift+e" },
    "trim trailing whitespace": { default: "ctrl+alt+t", mac: "opt+cmd+t" },
    uppercase: { default: "shift+f4" },
    lowercase: { default: "shift+f5" },
    capitalize: { default: "shift+f6" },
    "convert indent to spaces": { default: "ctrl+shift+y", mac: "cmd+shift+y" },
    "convert indent to tabs": { default: "ctrl+shift+i", mac: "cmd+shift+i" },
    "auto indent": { default: "ctrl+i", mac: "cmd+i" },
    "toggle bookmark": { default: "ctrl+alt+b", mac: "opt+cmd+b" },
    "go to next bookmark": { default: "ctrl+b", mac: "cmd+b" },
    "go to previous bookmark": { default: "ctrl+shift+b", mac: "cmd+shift+b" },
    "go to function": { default: "ctrl+alt+f", mac: "ctrl+cmd+j" },
    "go to line": { default: "ctrl+l", mac: "cmd+l" },
    "toggle breakpoint": { default: "f9", mac: "cmd+shift+b" },
    "remove all breakpoints": { default: "ctrl+shift+f9", mac: "cmd+shift+f9" },
    "go to next breakpoint": { default: "ctrl+.", mac: "cmd+." },
    "go to previous breakpoint": { default: "ctrl+,", mac: "cmd+," },
    "contextual help": { default: "alt+f1", mac: "opt+shift+space" },
  },
  scripteditor: {
    find: { default: "ctrl+f", mac: "cmd+f" },
    "find next": { default: "f3", mac: "f3" },
    "find previous": { default: "shift+f3", mac: "shift+f3" },
    "find in files": { default: "ctrl+shift+f", mac: "cmd+shift+f" },
    "move up": { default: "shift+alt+up", mac: "shift+opt+up" },
    "move down": { default: "shift+alt+down", mac: "shift+opt+down" },
    "next script": { default: "ctrl+shift+.", mac: "cmd+shift+." },
    "previous script": { default: "ctrl+shift+,", mac: "cmd+/shift+," },
    "reopen closed script": { default: "ctrl+shift+t", mac: "cmd+shift+t" },
    save: { default: "ctrl+alt+s", mac: "opt+cmd+s" },
    "save all": { default: "ctrl+shift+alt+s", mac: "cmd+shift+opt+s" },
    "soft reload script": { default: "ctrl+shift+r", mac: "cmd+shift+r" },
    "history previous": { default: "alt+left", mac: "cmd+opt+left" },
    "history next": { default: "alt+right", mac: "cmd+opt+right" },
    close: { default: "ctrl+w", mac: "cmd+w" },
    run: { default: "ctrl+shift+x", mac: "cmd+shift+x" },
    "toggle scripts panel": { default: "ctrl+\\", mac: "cmd+\\" },
    "zoom in": { default: "ctrl+=", mac: "cmd+=" },
    "zoom out": { default: "ctrl+-", mac: "cmd+-" },
    "reset zoom": { default: "ctrl+0", mac: "cmd+0" },
  },
  editoroutput: {
    "copy selection": { default: "ctrl+c", mac: "cmd+c" },
    "clear output": { default: "ctrl+shift+k", mac: "cmd+shift+k" },
  },
  debugger: {
    "step into": { default: "f11" },
    "step over": { default: "f10" },
    continue: { default: "f12" },
  },
  filedialog: {
    "go back": { default: "alt+left", mac: "opt+left" },
    "go forward": { default: "alt+right", mac: "opt+right" },
    "go up": { default: "alt+up", mac: "opt+up" },
    refresh: { default: "f5" },
    "toggle hidden files": { default: "ctrl+h", mac: "cmd+h" },
    "toggle favorite": { default: "alt+f", mac: "opt+f" },
    "toggle mode": { default: "alt+v", mac: "opt+v" },
    "create folder": { default: "ctrl+n", mac: "cmd+n" },
    delete: { default: "del", mac: "cmd+bksp" },
    "focus path": { default: "ctrl+d", mac: "cmd+d" },
    "move favorite up": { default: "ctrl+up", mac: "cmd+up" },
    "move favorite down": { default: "ctrl+down", mac: "cmd+down" },
  },
  filesystem: {
    "copy path": { default: "ctrl+shift+c", mac: "cmd+shift+c" },
    duplicate: { default: "ctrl+d", mac: "cmd+d" },
    delete: { default: "del", mac: "cmd+bksp" },
  },
  scenetree: {
    "add child node": { default: "ctrl+a", mac: "cmd+a" },
    "batch rename": { default: "ctrl+f2", mac: "cmd+f2" },
    "copy node path": { default: "ctrl+shift+c", mac: "cmd+shift+c" },
    delete: { default: "del", mac: "cmd+bksp" },
    "force delete": { default: "shift+del" },
    duplicate: { default: "ctrl+d", mac: "cmd+d" },
    "move up": { default: "ctrl+up", mac: "cmd+up" },
    "move down": { default: "ctrl+down", mac: "cmd+down" },
    // extra
    "instantiate child scene": { default: "ctrl+shift+a" },
  },
  animationtrack: {
    "duplicate selection": { default: "ctrl+d", mac: "cmd+d" },
    "duplicate transposed": { default: "ctrl+shift+d", mac: "cmd+shift+d" },
    "delete selection": { default: "del", mac: "cmd+bksp" },
    "go to next step": { default: "ctrl+right", mac: "cmd+right" },
    "go to previous step": { default: "ctrl+left", mac: "cmd+left" },
    // extra
    "play from start": { default: "shift+d" },
    "play from current": { default: "d" },
    "play back from start": { default: "shift+a" },
    "play back from current": { default: "a" },
  },
  tilemap: {
    select: { default: "s" },
    "cut selection": { default: "ctrl+x", mac: "cmd+x" },
    "copy selection": { default: "ctrl+c", mac: "cmd+c" },
    "paste selection": { default: "ctrl+v", mac: "cmd+v" },
    "delete selection": { default: "del", mac: "cmd+bksp" },
    cancel: { default: "esc" },
    paint: { default: "d" },
    line: { default: "l" },
    rect: { default: "r" },
    bucket: { default: "b" },
    picker: { default: "p" },
    eraser: { default: "e" },
    "flip horizontally": { default: "c" },
    "flip vertically": { default: "v" },
    "rotate left": { default: "z" },
    "rotate right": { default: "x" },
  },
  tileset: {
    // NOTE: some of these might be outdated
    "next coordinate": { default: "pgdown" },
    "previous coordinate": { default: "pgup" },
    "region mode": { default: "1" },
    "collision mode": { default: "2" },
    "occlusion mode": { default: "3" },
    "navigation mode": { default: "4" },
    "bitmask mode": { default: "5" },
    "priority mode": { default: "6" },
    "icon mode": { default: "7" },
    "z index mode": { default: "8" },
  },
} as const satisfies Record<string, Record<string, Shortcut>>;

interface Shortcut {
  default: string;
  mac?: string;
}

type ShortcutMap = typeof MAP;

export function GodotShortcut<
  K extends keyof ShortcutMap,
  T extends keyof ShortcutMap[K],
>(scope: string | K, type: string | T) {
  const shortcut = MAP[scope as K][type as T] as Shortcut | undefined;
  if (shortcut == null) {
    return "";
  }
  const hasMac = "mac" in shortcut;
  const className = `gdquest-godot-shortcut shortcut-windows shortcut-linux` +
    (hasMac ? "" : " shortcut-mac");

  return (
    `<span className="${className}">` +
    KeyboardShortcut(shortcut.default) +
    `</span>` +
    (hasMac
      ? `<span className="shortcut-none shortcut-mac"> (on Mac: </span>` +
        `<span className="shortcut-mac">` +
        KeyboardShortcut(shortcut.mac) +
        `</span>` +
        `<span className="shortcut-none shortcut-mac">)</span>`
      : "")
  );
}

const charmap = {
  enter: "↵",
  return: "↵",
  cmd: "⌘",
  command: "⌘",
  opt: "⌥",
  left: "←",
  up: "↑",
  right: "→",
  down: "↓",
};

const mouseTerms = ["lmb", "rmb"];

export const KeyboardShortcut = (children: string | undefined) => {
  if (!children) {
    return "";
  }
  const keys = (children + "")
    .toLowerCase()
    .replace(/\s+|\+/g, " ")
    .split(/\s/)
    .map((term) =>
      mouseTerms.includes(term)
        ? `<span className="gdquest-keyboard-key i-m-${term}"></span>`
        : `<span className="gdquest-keyboard-key-sequence gdquest-keyboard-key-letters-${term.length}">` +
          (charmap[term as keyof typeof charmap] ?? term) +
          `</span>`
    );
  const text = keys.join("");
  return `<kbd className="">` + text + `</kbd>`;
};
