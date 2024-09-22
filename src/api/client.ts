import { DefaultError, QueryClient, UseMutationOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError
  }
}

export const mutationOptions = <TData = unknown, TError = DefaultError, TVariables = void, TContext = unknown>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationOptions<TData, TError, TVariables, TContext> => options

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 500
    }
  }
})
