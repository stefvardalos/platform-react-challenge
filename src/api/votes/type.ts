import { Image } from '../cats/types.ts'

export type Vote = {
  image_id: string
  sub_id: string
  id: number
  image: Image
  created_at: Date
}