import { styled } from '@mui/material'
import { Breed } from '../../api/breeds/types.ts'

type Props = {
  breed: Breed
}

const Root = styled('div')`
  position: relative;

  img {
    width: 100%;
    object-fit: fill;
  }
`

const BreedImage = ({ breed }: Props) => {
  return (
    <Root>
      <img
        className="lazyload breed-image"
        data-src={
          breed.reference_image_id
            ? `https://cdn2.thecatapi.com/images/${breed.reference_image_id}.jpg`
            : 'https://cdn2.thecatapi.com/images/7CGV6WVXq.jpg'
        }
        alt={breed.name}
      />
    </Root>
  )
}

export default BreedImage
