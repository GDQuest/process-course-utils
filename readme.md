# Build tools

This toolset require Deno 2.x or later to run.

A set of tools to render markdown files and handle frontmatter.

Doesn't do anything by itself, but provides facilities to build GDQuest courses and knowledge bases.

Occasionally relies on the [product packager](https://github.com/GDQuest/product-packager/) to preformat markdown files.

It provides facilities to export HTML from markdown files, and to generate a JSON index of the content.

Currently, its html export is sub-par because it is missing a number of features present in the website builder; but long-term, we should be able to export html 100% from this builder without relying on Next's build system.
