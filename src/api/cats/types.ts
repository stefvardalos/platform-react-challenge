import { Breed } from '../breeds/types.ts'

export type Image = {
  id: string
  url: string
  width: number
  height: number
  breeds?: Breed[]
}
