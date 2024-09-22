import { Masonry } from '@mui/lab'
import { Card, CardContent, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { breedsListQuery } from '../../api/breeds/breeds.ts'
import { Breed } from '../../api/breeds/types.ts'
import Loader from '../../components/Loader.tsx'
import BreedImage from './BreedImage.tsx'
import BreedInfo from './breedInfo/BreedInfo.tsx'

const Root = styled('div')`
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;

  .breeds-container {
    padding: ${({ theme }) => theme.spacing(4)};
  }
`

const BreedsList = () => {
  const [urlParams, setUrlParams] = useSearchParams()

  const { data: breeds, error, isPending, isError } = useQuery(breedsListQuery())

  const showBreedInfo = (breed: Breed) => {
    setUrlParams({ breedId: breed.id })
  }

  const hideBreedInfo = () => {
    setUrlParams({})
  }

  const breedId = urlParams.get('breedId')

  if (isPending) return <Loader />
  if (isError) return <div>{error.message}</div>

  return (
    <>
      {breedId && <BreedInfo breedId={breedId} onClose={hideBreedInfo} />}
      <Root>
        <div className="breeds-container">
          <Masonry columns={{ xs: 1, md: 2, lg: 3 }} spacing={2}>
            {breeds.map(breed => (
              <Card key={breed.id} variant="outlined" onClick={() => showBreedInfo(breed)} className="clickable-item">
                <BreedImage breed={breed} />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {breed.name}
                  </Typography>
                  <Typography>{breed.temperament}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {breed.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Masonry>
        </div>
      </Root>
    </>
  )
}

export default BreedsList