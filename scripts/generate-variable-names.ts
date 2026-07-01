import fs from 'fs'
import path from 'path'

import postcss, { Rule } from 'postcss'

/**
 * Generates the themeable CSS custom properties exposed by the package, grouped
 * by source stylesheet.
 *
 * Reads every `--*` declaration defined directly on a base `:root` rule across
 * the themeable stylesheets and writes an object keyed by stylesheet name (e.g.
 * `ui`, `status`), each holding that sheet's deduplicated names in source order,
 * to `variables.json`. Inkdrop consumes this to know which variables a theme may
 * override at runtime.
 */

const STYLESHEETS = [
  'ui.css',
  'status.css',
  'tags.css',
  'task-progress.css',
  'markdown.css',
  'mermaid.css',
  'syntax.css'
]

/**
 * Collects the names of every custom property declared on a `:root` rule in the
 * given stylesheet, deduplicated and in source order.
 *
 * `:root` rules nested inside `@layer` blocks are included — only the immediate
 * parent rule's selector is inspected, so dark-mode overrides keyed off body
 * classes are intentionally skipped.
 */
const collectRootVariables = (cssPath: string): string[] => {
  const root = postcss.parse(fs.readFileSync(cssPath), { from: cssPath })
  const names: string[] = []
  root.walkDecls(/^--/, node => {
    if (
      node.parent?.type === 'rule' &&
      (node.parent as Rule).selector === ':root'
    ) {
      names.push(node.prop)
    }
  })
  return Array.from(new Set(names))
}

const variables: Record<string, string[]> = Object.fromEntries(
  STYLESHEETS.map(sheet => [
    path.basename(sheet, '.css'),
    collectRootVariables(path.resolve(import.meta.dirname, '..', sheet))
  ])
)

const total = Object.values(variables).reduce(
  (sum, names) => sum + names.length,
  0
)

const pathToOutput = path.resolve(import.meta.dirname, '..', 'variables.json')
fs.writeFileSync(pathToOutput, JSON.stringify(variables, null, 2) + '\n')

console.log(
  `Wrote ${total} variable names across ${Object.keys(variables).length} groups to ${path.relative(process.cwd(), pathToOutput)}`
)
