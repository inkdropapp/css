import { hsl } from './tokens'

export const taskProgress = {
  borderColor: `hsla(${hsl.gray950} / 0.3)`,
  backgroundColor: `hsla(${hsl.gray950} / 0.3)`,
  foregroundColor: `hsla(${hsl.white} / 0.6)`,
  completedColor: `hsl(${hsl.green500})`
}

export const taskProgressDark = {
  borderColor: `hsla(${hsl.gray50} / 0.1)`,
  backgroundColor: `hsla(${hsl.gray950} / 0.3)`,
  foregroundColor: `hsla(${hsl.gray50} / 0.6)`,
  completedColor: `hsl(${hsl.green500})`
}
