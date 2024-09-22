import { queryOptions } from '@tanstack/react-query'
import axios from 'axios'
import useCatsStore from '../../cats.store.ts'
import { mutationOptions, queryClient } from '../client.ts'
import { Vote } from './type.ts'

export const votesQuery = () => {
  return queryOptions({
    queryKey: ['vote'],
    queryFn: async () => {
      const { apiKey } = useCatsStore.getState().credentials || {}
      const response = await axios.get<Vote[]>(`https://api.thecatapi.com/v1/votes`, {
        params: { api_key: apiKey, attach_image: true, order: 'DESC', page: 0 }
      })
      return response.data
    }
  })
}

export const addVoteMutation = () =>
  mutationOptions({
    mutationKey: ['vote', 'add'],
    mutationFn: async ({ catId }: { catId: string }) => {
      const { apiKey, username } = useCatsStore.getState().credentials || {}
      const response = await axios.post<{ id: string }>(
        `https://api.thecatapi.com/v1/votes`,
        {
          image_id: catId,
          sub_id: username,
          value: 1
        },
        { params: { api_key: apiKey } }
      )
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: votesQuery().queryKey })
    }
  })

export const deleteVoteMutation = () =>
  mutationOptions({
    mutationKey: ['vote', 'delete'],
    mutationFn: async ({ voteId }: { voteId: string }) => {
      const { apiKey } = useCatsStore.getState().credentials || {}
      const response = await axios.delete<{ id: string }>(`https://api.thecatapi.com/v1/votes/${voteId}`, {
        params: { api_key: apiKey }
      })
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: votesQuery().queryKey })
    }
  })