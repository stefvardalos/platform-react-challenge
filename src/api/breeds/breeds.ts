import { queryOptions } from '@tanstack/react-query'
import axios from 'axios'
import useCatsStore from '../../cats.store.ts'
import { Breed } from './types'

export const breedsListQuery = () =>
  queryOptions({
    queryKey: ['breedsList'],
    queryFn: async ({ signal }) => {
      const { apiKey } = useCatsStore.getState().credentials || {}
      const response = await axios.get<Breed[]>('https://api.thecatapi.com/v1/breeds', {
        params: { api_key: apiKey },
        signal
      })
      return response.data
    },
    staleTime: 5 * 60 * 1000
  })

export const breedQuery = (breedId: string) =>
  queryOptions({
    queryKey: ['breed', breedId],
    queryFn: async ({ signal }) => {
      const { apiKey } = useCatsStore.getState().credentials || {}
      const response = await axios.get<Breed>(`https://api.thecatapi.com/v1/breeds/${breedId}`, {
        params: { api_key: apiKey },
        signal
      })
      return response.data
    }
  })
