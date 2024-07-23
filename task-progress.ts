import { hsl } from './tokens'

export const taskProgress = {
  borderColor: `hsl(${hsl.gray950} / 30%)`,
  backgroundColor: `hsl(${hsl.gray950} / 30%)`,
  foregroundColor: `hsl(${hsl.white} / 60%)`,
  completedColor: `hsl(${hsl.green500})`
}

export const taskProgressDark = {
  borderColor: `hsl(${hsl.gray50} / 10%)`,
  backgroundColor: `hsl(${hsl.gray950} / 30%)`,
  foregroundColor: `hsl(${hsl.gray50} / 60%)`,
  completedColor: `hsl(${hsl.green500})`
}
