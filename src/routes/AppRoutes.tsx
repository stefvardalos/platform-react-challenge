import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import App from '../App.tsx'
import useCatsStore from '../cats.store.ts'
import BreedsList from '../pages/breedsListing/BreedsList.tsx'
import CatsList from '../pages/catsListing/CatsList.tsx'
import Favorites from '../pages/favorites/Favorites.tsx'
import Login from '../pages/login/Login.tsx'
import Votes from '../pages/votes/Votes.tsx'

const AppRoutes = () => {
  const credentials = useCatsStore(state => state.credentials)

  const isAuthenticated = credentials !== undefined

  const newRouter = createBrowserRouter([
    {
      path: 'login',
      element: !isAuthenticated ? <Login /> : <Navigate to="cats" />
    },
    {
      path: '/',
      element: isAuthenticated ? <App /> : <Navigate to="login" />,
      children: [
        {
          index: true,
          element: <Navigate to="cats" replace />
        },
        {
          path: 'cats',
          element: <CatsList />
        },
        {
          path: 'breeds',
          element: <BreedsList />
        },
        {
          path: 'favorites',
          element: <Favorites />
        },
        {
          path: 'votes',
          element: !!credentials?.apiKey ? <Votes /> : <Navigate to="login" />
        }
      ]
    },
    { path: '*', element: <Navigate to="/" replace /> }
  ])

  return <RouterProvider router={newRouter} />
}

export default AppRoutes