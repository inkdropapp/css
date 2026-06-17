import fs from 'fs'
import path from 'path'

import postcss, { Rule } from 'postcss'

/**
 * Generates the list of themeable CSS custom properties exposed by the package.
 *
 * Reads every `--*` declaration defined directly on a base `:root` rule across
 * the themeable stylesheets and writes the deduplicated names, in source order,
 * to `variables.json`. Inkdrop consumes this list to know which variables a
 * theme may override at runtime.
 */

const STYLESHEETS = ['ui.css', 'status.css', 'tags.css', 'task-progress.css']

/**
 * Collects the names of every custom property declared on a `:root` rule in the
 * given stylesheet, in source order.
 *
 * `:root` rules nested inside `@layer` blocks are included — only the immediate
 * parent rule's selector is inspected, so dark-mode overrides keyed off body
 * classes are intentionally skipped.
 */
const collectRootVariables = (cssPath: string): string[] => {
  const css = fs.readFileSync(cssPath)
  const root = postcss.parse(css, { from: cssPath })
  const names: string[] = []
  root.walkDecls(/^--/, node => {
    if (node.parent?.type === 'rule' && (node.parent as Rule).selector === ':root') {
      names.push(node.prop)
    }
  })
  return names
}

const names = STYLESHEETS.flatMap(sheet =>
  collectRootVariables(path.resolve(import.meta.dirname, '..', sheet))
)
const variables = Array.from(new Set(names))

const pathToOutput = path.resolve(import.meta.dirname, '..', 'variables.json')
fs.writeFileSync(pathToOutput, JSON.stringify(variables, null, 2) + '\n')

console.log(
  `Wrote ${variables.length} variable names to ${path.relative(process.cwd(), pathToOutput)}`
)
