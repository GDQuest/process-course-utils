const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link'];


export const isSelfClosingTag = (tagName: string, children?: unknown[]) => (selfClosingTags.includes(tagName) && (!children || children.length === 0))