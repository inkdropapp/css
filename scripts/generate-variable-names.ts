import fs from 'fs'
import path from 'path'

import postcss, { Rule } from 'postcss'

/**
 * Generates the list of themeable CSS custom properties exposed by `ui.css`.
 *
 * Reads every `--*` declaration defined directly on the base `:root` rule and
 * writes the deduplicated names, in source order, to `ui.json`. Inkdrop consumes
 * this list to know which variables a theme may override at runtime.
 */

const pathToUICSS = path.resolve(import.meta.dirname, '..', 'ui.css')
const uiCSS = fs.readFileSync(pathToUICSS)

const variables = new Set<string>()
const root = postcss.parse(uiCSS, { from: pathToUICSS })
root.walkDecls(/^--/, node => {
  if (node.parent && node.parent.type === 'rule') {
    const parent = node.parent as Rule
    if (parent.selector === ':root') {
      variables.add(node.prop)
    }
  }
})

const pathToOutput = path.resolve(import.meta.dirname, '..', 'ui.json')
fs.writeFileSync(pathToOutput, JSON.stringify(Array.from(variables), null, 2) + '\n')

console.log(
  `Wrote ${variables.size} variable names to ${path.relative(process.cwd(), pathToOutput)}`
)
