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
 *
 * The `syntax` group is special: `syntax.css` ships only base rules that
 * reference `--syntax-*` variables via `var()` — the values are defined by each
 * syntax theme. The default light syntax theme is the canonical set, so it is
 * downloaded and its `:root` declarations supply that group (see
 * {@link SYNTAX_THEME_URL}).
 */

const STYLESHEETS = [
  'ui.css',
  'status.css',
  'tags.css',
  'task-progress.css',
  'markdown.css'
]

/**
 * Raw URL of the default light syntax theme's stylesheet, the canonical source
 * for the `--syntax-*` / `--editor-*` variables a syntax theme may override.
 */
const SYNTAX_THEME_URL =
  'https://raw.githubusercontent.com/inkdropapp/default-light-syntax-theme/master/styles/index.css'

/**
 * Collects the names of every custom property declared on a `:root` rule in the
 * given CSS, deduplicated and in source order.
 *
 * `:root` rules nested inside `@layer` blocks are included — only the immediate
 * parent rule's selector is inspected, so dark-mode overrides keyed off body
 * classes are intentionally skipped.
 *
 * @param css - The stylesheet source to parse.
 * @param from - A source label used by PostCSS for error messages.
 */
const collectRootVariables = (css: string | Buffer, from: string): string[] => {
  const root = postcss.parse(css, { from })
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

/** Reads a local stylesheet and collects its `:root` custom-property names. */
const collectFromFile = (cssPath: string): string[] =>
  collectRootVariables(fs.readFileSync(cssPath), cssPath)

/**
 * Downloads a remote stylesheet and collects its `:root` custom-property names.
 *
 * @param url - The stylesheet to download.
 * @throws If the stylesheet cannot be downloaded.
 */
const collectFromUrl = async (url: string): Promise<string[]> => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`)
    }
    return collectRootVariables(await response.text(), url)
  } catch (error) {
    console.error(`Failed to download ${url}:`, error)
    throw new Error(`Could not fetch syntax theme variables from ${url}`)
  }
}

const variables: Record<string, string[]> = Object.fromEntries(
  STYLESHEETS.map(sheet => [
    path.basename(sheet, '.css'),
    collectFromFile(path.resolve(import.meta.dirname, '..', sheet))
  ])
)

variables.syntax = await collectFromUrl(SYNTAX_THEME_URL)

const total = Object.values(variables).reduce(
  (sum, names) => sum + names.length,
  0
)

const pathToOutput = path.resolve(import.meta.dirname, '..', 'variables.json')
fs.writeFileSync(pathToOutput, JSON.stringify(variables, null, 2) + '\n')

console.log(
  `Wrote ${total} variable names across ${Object.keys(variables).length} groups to ${path.relative(process.cwd(), pathToOutput)}`
)
