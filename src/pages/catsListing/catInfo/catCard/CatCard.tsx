import { Favorite, FavoriteBorder, ThumbUp } from '@mui/icons-material'
import {
  CardActions,
  cardActionsClasses,
  CardContent,
  cardContentClasses,
  Chip,
  Paper,
  PaperProps,
  styled,
  Typography
} from '@mui/material'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CSSProperties, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Image } from '../../../../api/cats/types.ts'
import { addFavoriteMutation, deleteFavoriteMutation, favoritesQuery } from '../../../../api/favorites/favorites.ts'
import { addVoteMutation } from '../../../../api/votes/votes.ts'
import useCatsStore from '../../../../cats.store.ts'

type Props = {
  cat: Image
  type: 'modal' | 'paper'
}

const Root = styled(Paper)<{ type: Props['type'] } & PaperProps>`
  width: 100%;
  min-width: ${({ type }) => (type === 'modal' ? `min(90vw, 580px)` : `180px`)};
  overflow: hidden;

  .image-container {
    position: relative;

    &:before {
      content: '';
      display: block;
      padding-bottom: calc((var(--image-height) / var(--image-width)) * 100%);
    }

    .cat-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: fill;
    }
  }

  .chips-container {
    flex-wrap: wrap;
  }

  .${cardContentClasses.root} {
    padding: ${({ theme }) => theme.spacing(2, 3)};
  }

  .${cardActionsClasses.root} {
    justify-content: space-between;
    padding: ${({ theme }) => theme.spacing(2, 3)};
  }
`

const CatCard = ({ cat, type }: Props) => {
  const { favorites: localFavorites, toggleFavorite, credentials } = useCatsStore()

  const { data: remoteFavorites, isLoading } = useQuery({ ...favoritesQuery(), enabled: !!credentials?.apiKey })

  const favorites = useMemo(
    () => (credentials?.apiKey ? remoteFavorites?.map(favorite => favorite.image_id) || [] : localFavorites),
    [localFavorites, remoteFavorites, credentials?.apiKey]
  )

  const isFavorite = useMemo(() => favorites.find(id => id === cat.id), [favorites, cat.id])

  const { mutateAsync: addFavorite, isPending: isPendingAdd } = useMutation(addFavoriteMutation())
  const { mutateAsync: removeFavorite, isPending: isPendingRemove } = useMutation(deleteFavoriteMutation())

  const { mutateAsync: addVote, isPending: isPendingAddVote } = useMutation(addVoteMutation())

  const handleToggleFavorite = async (catId: string) => {
    if (!credentials?.apiKey) {
      toggleFavorite(catId)
    } else {
      if (isFavorite) {
        await removeFavorite({ catId })
      } else {
        await addFavorite({ catId })
      }
    }
  }

  return (
    <Root type={type} variant="outlined">
      <div
        className="image-container"
        style={{ '--image-height': cat.height, '--image-width': cat.width } as CSSProperties}>
        <img className="lazyload cat-image" data-src={`${cat.url}?tr-w`} alt={cat.id} />
      </div>
      {cat.breeds && (
        <CardContent>
          {cat.breeds.map((breed, index, allBreeds) => (
            <span key={breed.id}>
              <Stack direction="column" spacing={1}>
                <Typography gutterBottom variant="h5" component="div">
                  {breed.name}
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap className="chips-container">
                  {breed.temperament.split(',').map((temperament, index) => (
                    <Chip key={index} color="primary" variant="outlined" label={temperament} />
                  ))}
                </Stack>
                <Typography variant="body2" color="textSecondary">
                  {breed.description}
                </Typography>
              </Stack>
              {index !== allBreeds.length - 1 && <Divider></Divider>}
            </span>
          ))}
        </CardContent>
      )}
      <CardActions sx={{ mt: 'auto', justifyContent: 'space-between' }}>
        <Button
          variant="text"
          color={isFavorite ? 'error' : 'primary'}
          startIcon={isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
          disabled={isPendingAdd || isPendingRemove || (isLoading && !!credentials)}
          onClick={() => handleToggleFavorite(cat.id)}>
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Button>
        {!!credentials?.apiKey && (
          <Button
            variant="text"
            startIcon={<ThumbUp />}
            onClick={() => addVote({ catId: cat.id })}
            disabled={isPendingAddVote}>
            Vote Up!
          </Button>
        )}
        {cat.breeds && (
          <Button variant="text" component={Link} to={'/breeds?breedId=' + cat.breeds[0].id}>
            Read More About The Breed
          </Button>
        )}
      </CardActions>
    </Root>
  )
}

export default CatCard