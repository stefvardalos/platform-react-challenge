import { infiniteQueryOptions, keepPreviousData, queryOptions, skipToken } from '@tanstack/react-query'
import axios from 'axios'
import useCatsStore from '../../cats.store.ts'
import { Image } from './types'

export const catImagesInfiniteQuery = (breedId: string = '', limit: number = 10) =>
  infiniteQueryOptions({
    queryKey: ['catsList', breedId],
    queryFn: async ({ pageParam, signal }) => {
      const { apiKey } = useCatsStore.getState().credentials || {}
      const response = await axios.get<Image[]>('https://api.thecatapi.com/v1/images/search', {
        params: {
          limit: limit,
          breed_ids: breedId,
          page: pageParam,
          api_key: apiKey
        },
        signal
      })
      return response.data
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined
    },
    placeholderData: keepPreviousData
  })

export const catQuery = (catId: string | undefined) =>
  queryOptions({
    queryKey: ['cat', catId],
    queryFn: catId
      ? async ({ signal }) => {
          const { apiKey } = useCatsStore.getState().credentials || {}
          const response = await axios.get<Image>(`https://api.thecatapi.com/v1/images/${catId}`, {
            params: { api_key: apiKey },
            signal
          })
          return response.data
        }
      : skipToken
  })
