import { queryOptions, skipToken } from '@tanstack/react-query'
import axios from 'axios'
import useCatsStore from '../../cats.store.ts'
import { mutationOptions, queryClient } from '../client.ts'
import { Favorite } from './type.ts'

export const favoritesQuery = () => {
  const { apiKey, username } = useCatsStore.getState().credentials || {}
  return queryOptions({
    queryKey: ['favorite', apiKey, username],
    queryFn: apiKey
      ? async ({ signal }) => {
          const response = await axios.get<Favorite[]>(`https://api.thecatapi.com/v1/favourites`, {
            params: { api_key: apiKey, sub_id: username, page: 0 },
            signal
          })
          return response.data
        }
      : skipToken
  })
}

export const addFavoriteMutation = () =>
  mutationOptions({
    mutationKey: ['favorite', 'add'],
    mutationFn: async ({ catId }: { catId: string }) => {
      const { apiKey, username } = useCatsStore.getState().credentials || {}
      const response = await axios.post<{ id: string }>(
        `https://api.thecatapi.com/v1/favourites`,
        {
          image_id: catId,
          sub_id: username
        },
        { params: { api_key: apiKey } }
      )
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: favoritesQuery().queryKey })
    }
  })

export const deleteFavoriteMutation = () =>
  mutationOptions({
    mutationKey: ['favorite', 'delete'],
    mutationFn: async ({ catId }: { catId: string }) => {
      const { apiKey, username } = useCatsStore.getState().credentials || {}
      const favorite = await axios.get<Favorite[]>(`https://api.thecatapi.com/v1/favourites`, {
        params: { api_key: apiKey, image_id: catId, sud_id: username }
      })
      const id = favorite.data[0].id
      const response = await axios.delete<{ id: string }>(`https://api.thecatapi.com/v1/favourites/${id}`, {
        params: { api_key: apiKey }
      })
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: favoritesQuery().queryKey })
    },
    onError: async () => {
      await queryClient.invalidateQueries({ queryKey: favoritesQuery().queryKey })
    }
  })