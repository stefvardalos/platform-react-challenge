import { CircularProgress, styled } from '@mui/material'

const Root = styled('div')`
  display: flex;
  width: 100%;
  height: 75%;
  overflow-x: hidden;
  overflow-y: auto;
  align-items: center;
  justify-content: center;
`

const Loader = () => (
  <Root>
    <CircularProgress />
  </Root>
)

export default Loader
