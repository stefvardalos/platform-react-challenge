import { Backdrop, Dialog } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { breedQuery } from '../../../api/breeds/breeds.ts'
import { catImagesInfiniteQuery } from '../../../api/cats/cats.ts'
import Loader from '../../../components/Loader.tsx'
import BreedCard from './breedCard/BreedCard.tsx'

type Props = {
  breedId: string
  onClose: () => void
}

const StyledBackdrop = styled(Backdrop)`
  z-index: ${({ theme }) => theme.zIndex.drawer + 1};
`
const BreedInfo = ({ breedId, onClose }: Props) => {
  const { data: breed, isPending: isPendingBreed, isError: isErrorBreed } = useQuery(breedQuery(breedId))

  const {
    data: breedImages,
    isPending: isPendingImages,
    isError: isErrorImages
  } = useInfiniteQuery(catImagesInfiniteQuery(breedId, 10))

  if (isPendingBreed || isPendingImages) {
    return (
      <StyledBackdrop open={true} onClick={onClose}>
        <Loader />
      </StyledBackdrop>
    )
  }

  if (isErrorBreed || isErrorImages) {
    onClose()
    return null
  }

  return (
    <Dialog open={true} maxWidth="md" onClose={onClose}>
      <BreedCard breed={breed} breedCats={breedImages.pages.flat()} type="modal" />
    </Dialog>
  )
}

export default BreedInfo
