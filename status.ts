import { NOTE_STATUS } from 'inkdrop-model'
import { hsl } from './tokens'

export const status = {
  [NOTE_STATUS.ACTIVE]: `hsl(${hsl.slate400})`,
  [NOTE_STATUS.ON_HOLD]: `hsl(${hsl.amber500})`,
  [NOTE_STATUS.COMPLETED]: `hsl(${hsl.emerald500})`,
  [NOTE_STATUS.DROPPED]: `hsl(${hsl.rose400})`
}
