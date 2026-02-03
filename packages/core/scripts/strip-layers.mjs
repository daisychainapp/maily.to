import fs from 'node:fs/promises'
import postcss from 'postcss'

// Tailwind v4 outputs layered CSS. Our host app uses unlayered CSS, and
// unlayered rules always win in the cascade, so Maily styles can be overridden.
// This postbuild step removes @layer rules and source map comments so the
// package ships unlayered CSS and avoids missing .map warnings in Vite.

const files = [
  new URL('../dist/index.css', import.meta.url)
]

const stripLayers = (root) => {
  root.walkAtRules('layer', (rule) => {
    if (rule.nodes && rule.nodes.length > 0) {
      rule.replaceWith(rule.nodes)
      return
    }

    rule.remove()
  })
}

const stripSourceMapComment = (css) => {
  return css.replace(/\n?\/\*# sourceMappingURL=.*?\*\/\s*$/s, '\n')
}

const run = async () => {
  await Promise.all(files.map(async (fileUrl) => {
    const filePath = fileUrl.pathname
    const css = await fs.readFile(filePath, 'utf8')
    const root = postcss.parse(css)
    stripLayers(root)
    const output = stripSourceMapComment(root.toString())
    await fs.writeFile(filePath, output, 'utf8')
  }))
}

run()
