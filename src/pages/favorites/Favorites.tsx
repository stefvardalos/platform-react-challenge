import { ListItemButton, listItemButtonClasses, ListItemText, styled, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { catQuery } from '../../api/cats/cats.ts'
import { Image } from '../../api/cats/types.ts'
import { favoritesQuery } from '../../api/favorites/favorites.ts'
import useCatsStore from '../../cats.store.ts'
import Loader from '../../components/Loader.tsx'
import BreedCard from '../breedsListing/breedInfo/breedCard/BreedCard.tsx'
import CatCard from '../catsListing/catInfo/catCard/CatCard.tsx'

const Root = styled('div')`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;

  .favorite-list {
    min-width: min(30vw, 380px);
    display: flex;
    flex-direction: column;

    padding: ${({ theme }) => theme.spacing(3)};
    gap: ${({ theme }) => theme.spacing(1)};

    .${listItemButtonClasses.root} {
      border-radius: ${({ theme }) => theme.shape.borderRadius}px;
      flex-grow: 0;
    }
  }

  .favorite-details {
    flex-grow: 1;
    overflow: auto;
    padding: ${({ theme }) => theme.spacing(3, 2)};

    .cat-details {
      max-width: 600px;
    }

    .breed-details {
      max-width: 800px;
    }
  }
`

const StyledDetails = styled('div')`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`

const Favorite = ({ cat }: { cat: Image }) => {
  return (
    <StyledDetails>
      <Typography gutterBottom variant="h5" component="div">
        Cat Info
      </Typography>
      <div className="cat-details">
        <CatCard key={cat.id} cat={cat} type="paper" />
      </div>
      {cat?.breeds?.length && (
        <>
          <Typography gutterBottom variant="h5" component="div">
            Breeds Info
          </Typography>
          {cat.breeds.map(breed => (
            <div key={breed.id} className="breed-details">
              <BreedCard breed={breed} breedCats={[]} type="paper" />
            </div>
          ))}
        </>
      )}
    </StyledDetails>
  )
}

const Favorites = () => {
  const { favorites: localFavorites, credentials } = useCatsStore()

  const {
    data: remoteFavorites,
    isLoading,
    isError,
    error
  } = useQuery({ ...favoritesQuery(), enabled: !!credentials?.apiKey })

  const favorites = useMemo(
    () => (credentials?.apiKey ? remoteFavorites?.map(favorite => favorite.image_id) || [] : localFavorites),
    [localFavorites, remoteFavorites, credentials?.apiKey]
  )

  const [selectedId, setSelectedId] = useState<string | undefined>(() => favorites[0])

  const { data: selected } = useQuery(catQuery(selectedId))

  useEffect(() => {
    if (selectedId && !favorites.includes(selectedId)) {
      setSelectedId(favorites[0])
    }
  }, [favorites, setSelectedId])

  if (isLoading) return <Loader />
  if (isError) return <div>{error.message}</div>

  return (
    <Root>
      <div className="favorite-list" aria-label="favorite cats">
        <Typography gutterBottom variant="h5" component="div">
          My Favorite Cats
        </Typography>
        {favorites.length === 0 && (
          <Typography gutterBottom variant="h6" component="div">
            There are no favorites yet!
          </Typography>
        )}
        {favorites.map(favoriteId => (
          <ListItemButton
            key={favoriteId}
            selected={selectedId === favoriteId}
            onClick={() => setSelectedId(favoriteId)}>
            <ListItemText primary={favoriteId} />
          </ListItemButton>
        ))}
      </div>
      <div className="favorite-details">{selected && <Favorite cat={selected} />}</div>
    </Root>
  )
}

export default Favorites