import { GodotShortcut } from "./godotShortcut.ts";
import { parseHtmlAttributes } from "../parseHTMLAttributes.ts";
import { componentsMap } from "./componentsMap.ts";


/**
 * Test to attempt to skip React custom elements and simply use valid HTML markup with CSS instead
 * This uses regex to replace custom tags with raw html.
 * @param content
 */
export function transformCustomHTMLTags(content: string) {
  return content
    .replace(/<Glossary\s+([\s\S]*?)\/>/g, (full, contents: string) => {
      const { term, label } = parseHtmlAttributes(contents);
      if (term === "" || typeof term !== "string") {
        return full;
      }
      if (typeof label !== "string" || label === "" || label == null) {
        return componentsMap.Glossary({ term, label: term });
      }
      return componentsMap.Glossary({ term, label });
    })
    .replace(/<Figure(.*?)>([\s\S]+?)<\/Figure>/g, (_full, rest, children) => {
      const { caption = "" } = parseHtmlAttributes(rest) as { caption: string };
      return componentsMap.Figure({ caption, children });
    })
    .replace(/<PublicImage(.*?)\/>/g, (_full, rest) => {
      const attrs = parseHtmlAttributes(rest) as {
        src: string;
        alt: string;
        width: number | "auto";
        height: number | "auto";
        className?: string;
      };
      return componentsMap.PublicImage(attrs);
    })
    .replace(
      /<Callout\s+type="(.*?)"\s+title="(.*?)"\s*?(open)?>([\s\S]*?)<\/Callout>/g,
      (full, type, title, open, children) => {
        return componentsMap.Callout({
          type,
          title,
          open,
          children: children,
          hasContents: full,
        });
      }
    )
    .replace(/<\/dl>[\n\s]*?<dl.*?>/gm, "") // hack to collapse multiple callouts
    .replace(/<IconGodot\s+(.*?)\/>\s*?`\w+`/g, (_full, rest) => {
      const { currentColor, name } = parseHtmlAttributes(rest) as {
        currentColor: string;
        name: string;
      };
      return componentsMap.IconGodot({
        currentColor: currentColor === "true",
        name,
      });
    })
    .replace(/<VideoEmbed url="(.*?)"\s*\/>/g, (full, url: string) => {
      const embed = componentsMap.VideoEmbed({ url });
      if (embed === "") {
        return full;
      }
      return embed;
    })
    .replace(
      /<VideoFile src="(.*?)"\s*\/>/g, // useDefaultAspectRatio is unused in glossary, so it's not handled
      (_full, src: string) => {
        return componentsMap.VideoFile({ src });
      }
    )
    .replace(/<Note>([\s\S]*?)<\/Note>/g, (_full, children) => {
      return componentsMap.Note({ children });
    })
    .replace(
      /<QuoteBubbleNathan>([\s\S]*?)<\/QuoteBubbleNathan>/g,
      (_full, children) => {
        return componentsMap.QuoteBubbleNathan({ children });
      }
    )
    .replace(
      /<GodotShortcut\s+(?:scope="(.*?)\s+)?type="(.*?)"\s+\/>/g,
      (_full, scope: string, type: string) => {
        scope = scope?.trim() ?? "general";
        return GodotShortcut(scope, type);
      }
    );
}
