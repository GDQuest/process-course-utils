const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link', 'wbr', 'base', 'col', 'embed', 'param', 'source', 'track'];


export const isSelfClosingTag = (tagName: string, children?: unknown[]) => (selfClosingTags.includes(tagName) && (!children || children.length === 0))