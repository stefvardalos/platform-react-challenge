import { create, StateCreator } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type State = {
  credentials: { apiKey: string; username?: string } | undefined
  favorites: string[]
}

type Actions = {
  setCredentials: (apiKey: string, username?: string) => void
  clearCredentials: () => void
  toggleFavorite: (catId: string) => void
  clearFavorites: () => void
}

const initial: State = {
  credentials: undefined,
  favorites: []
}

const createCatsStore: StateCreator<State & Actions, [['zustand/immer', never], any]> = set => ({
  ...initial,
  setCredentials: (apiKey, username) => set({ credentials: { apiKey, username } }),
  clearCredentials: () => set({ credentials: undefined }),
  toggleFavorite: catId => {
    set(state => {
      if (state.favorites.includes(catId)) {
        state.favorites = state.favorites.filter((id: string) => id !== catId)
      } else {
        state.favorites.push(catId)
      }
    })
  },
  clearFavorites: () => set({ favorites: [] })
})

const useCatsStore = create<State & Actions>()(
  persist(immer(devtools(createCatsStore, { name: 'client-state', store: 'cats' })), {
    name: 'cats-storage',
    storage: createJSONStorage(() => localStorage),
    version: 1
  })
)

export default useCatsStore
