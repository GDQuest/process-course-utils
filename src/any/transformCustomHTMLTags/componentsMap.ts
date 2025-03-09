import { simpleHash } from "../simpleHash.ts";
import { slugify } from "../slugify.ts";

export const componentsMap = {
  Glossary: ({ term, label }: { term: string; label: string }) =>
    `<a className="gdquest-glossary-link" href="/glossary/${term}">${
      label ?? term
    }</a>`,
  Figure: ({ caption, children }: { caption: string; children: string }) =>
    `<figure className="gdquest-figure">\n${children}\n<figcaption>${caption}</figcaption>\n</figure>`,
  PublicImage: ({
    src,
    alt,
    width = "auto",
    height = "auto",
    className = "",
  }: {
    src: string;
    alt: string;
    width: number | "auto";
    height: number | "auto";
    className?: string;
  }) =>
    `<span className="gdquest-image-root">` +
    `<span className="gdquest-image-container">` +
    `<img src="${src}" alt="${alt}" className="${className}" width="${width}" height="${height}"/>` +
    `<span className="gdquest-image-buttons-container">` +
    `<a href="${src}" className="gdquest-image-link-new-tab" target="_blank" title="Open image in new tab" aria-label="Open image in new tab">` +
    `<span className="visually-hidden">Open image in new tab</span>` +
    `</a>` +
    `</span>` +
    `</span>` +
    `</span>`,
  Callout: ({
    type,
    title,
    open,
    children,
    hasContents,
  }: {
    hasContents: string;
    type: string;
    title: string;
    open: string;
    children: string;
  }) => {
    const openClass = open ? " initially-open" : "";
    const typeClass = `gdquest-callout__${type}`;
    const id = `callout-${slugify(title)}-${simpleHash(hasContents)}`;
    return (
      `<dl className="gdquest-callout">\n` + // if multiple callouts, it'd be good to put them all under a single dl
      `<dt className="gdquest-callout-summary ${typeClass}" suppressHydrationWarning={true}>` +
      `<button className="${openClass}" suppressHydrationWarning={true} type="button" aria-expanded="true" aria-controls="${id}">` +
      title +
      `</button>` +
      `</dt>\n` +
      `<dd className="gdquest-callout-content-target" suppressHydrationWarning={true} id="${id}">` +
      `<div className="gdquest-callout-content-wrapper">` +
      `<div className="gdquest-callout-content">\n${children}\n</div>` +
      `</div>` +
      `</dd>\n` +
      `</dl>`
    );
  },
  IconGodot: ({
    currentColor,
    name,
  }: {
    currentColor: boolean;
    name: string;
  }) => {
    const iconClasses =
      `i-gd-${name}` + (currentColor ? " i-gd-use-currentColor" : "");
    return (
      `<span className="gdquest-icon-godot">` +
      `<span className="${iconClasses}" aria-hidden="true"></span>` +
      `<span className="gdquest-icon-godot-label">` +
      name +
      `</span></span>`
    );
  },
  GodotEmbed: ({
    src,
    title = "Godot Game",
  }: {
    src: string;
    title?: string;
  }) => {
    if (!src) {
      throw new Error("No `src` property provided for GodotEmbed");
    }
    return [
      `<iframe className="gdquest-godot-embed"`,
      `src="${src}"`,
      `title="${title}"`,
      `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"`,
      `allowFullScreen`,
      `/>`,
    ].join(" ");
  },
  VideoEmbed: ({
    url,
    title = "youtube video player",
  }: {
    url: string;
    title?: string;
  }) => {
    if (!url) {
      throw new Error("No `url` property provided for VideoEmbed");
    }
    const youtubeUrlRegex =
      /(?:youtube\.com(?:\/watch\?.*v=|\/embed\/)|youtu\.be\/)(?<videoId>[a-zA-Z_\d-]+)\??/;
    const vimeoUrlRegex =
      /vimeo\.com\/(video\/)?(?<videoId>\d+)(?:(\?h=|\/)(?<unlistedHash>[0-9a-z]+))?/;

    let provider = "youtube";
    let videoId = url.match(youtubeUrlRegex)?.groups?.videoId ?? ""
    let src = `https://www.youtube-nocookie.com/embed/${videoId}`
    if (videoId == null || videoId === "") {
      provider = "vimeo";
      videoId = url.match(vimeoUrlRegex)?.groups?.videoId ?? "";
      if (videoId == null || videoId === "") {
        return "";
      }
      src = `https://player.vimeo.com/video/${videoId}`;
    }

    return [
      `<iframe className="video-${provider}"` ,
      `src="${src}"`,
      `title="${title || "video"}"`,
      `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"`,
      `allowFullScreen`,
      `/>`,
    ].join(" ");
  },
  VideoFile: ({ src }: { src: string }) => {
    if (src === "") {
      return "";
    }

    const mimeTypes = {
      mp4: "video/mp4",
      webm: "video/webm",
      mov: "video/mov",
      ogg: "video/ogg",
      ogv: "video/ogv",
    };

    const mimeType =
      mimeTypes[
        (src.split(".").pop() ?? "").toLowerCase() as keyof typeof mimeTypes
      ];

    return (
      `<div className="gdquest-video-file">` +
      `<video className="gdquest-video-file-video" width="100%" height="100%" muted loop controls playsInline preload="metadata">` +
      `<source src="${src}" type="${mimeType}" />` +
      `Your browser does not support the video tag.` +
      `<a href="${src}">Download the video instead</a>` +
      `</video>` +
      `<span className="gdquest-image-buttons-container">` + // not a mistake, it's the same as for images
      `<a href="${src}" className="gdquest-image-link-new-tab" target="_blank" title="Open video in new tab" aria-label="Open video in new tab">` +
      `<span className="visually-hidden">Open video in new tab</span>` +
      `</a>` +
      `</span>` +
      `</div>`
    );
  },
  Note: ({ children }: { children: string }) =>
    `<blockquote className="gdquest-note">\n` +
    `<h4 className="gdquest-note-title">Note:</h4>\n` +
    `<div className="gdquest-note-content">\n${children}\n</div>\n` +
    `</blockquote>`,
  QuoteBubbleNathan: ({ children }: { children: string }) =>
    `<figure className="gdquest-quote-bubble">` +
    `<blockquote className="gdquest-quote-bubble-contents prose-container">\n` +
    `${children}` +
    `\n</blockquote>` +
    `<figcaption className="gdquest-quote-bubble-author">\n` +
    `<h4 className="gdquest-quote-bubble-author-name">Nathan</h4>` +
    `<h5 className="gdquest-quote-bubble-author-title">Founder and teacher at GDQuest</h5>` +
    `\n</figcaption>` +
    `</figure>`,
} as const;