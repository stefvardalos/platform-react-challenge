import { Backdrop, Dialog } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import { catQuery } from '../../../api/cats/cats.ts'
import Loader from '../../../components/Loader.tsx'
import CatCard from './catCard/CatCard.tsx'

type Props = {
  catId: string
  onClose: () => void
}

const StyledBackdrop = styled(Backdrop)`
  z-index: ${({ theme }) => theme.zIndex.drawer + 1};
`

const CatInfo = ({ catId, onClose }: Props) => {
  const { data, isPending, isError } = useQuery(catQuery(catId))

  if (isPending) {
    return (
      <StyledBackdrop open={true} onClick={onClose}>
        <Loader />
      </StyledBackdrop>
    )
  }

  if (isError) {
    onClose()
    return null
  }

  return (
    <Dialog open={true} onClose={onClose}>
      <CatCard cat={data} type="modal" />
    </Dialog>
  )
}

export default CatInfo