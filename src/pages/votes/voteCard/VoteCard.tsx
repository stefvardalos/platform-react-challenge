import { CardContent, Paper, styled, Typography } from '@mui/material'
import { CSSProperties } from 'react'
import { Vote } from '../../../api/votes/type.ts'

const Root = styled(Paper)`
  width: 100%;
  min-width: 180px;
  overflow: hidden;

  .image-container {
    position: relative;

    image {
      height: 50px;
      widht: 50px;
    }

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
`

const VoteCard = ({ vote }: { vote: Vote }) => {
  return (
    <Root variant="outlined">
      <div className="image-container" style={{ '--image-height': 50, '--image-width': 50 } as CSSProperties}>
        <img className="lazyload cat-image" data-src={`${vote.image.url}?tr-w`} alt={vote.image.id} />
      </div>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {vote.sub_id} gave a +1 on {vote.image.id}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          At {new Date(vote.created_at).toLocaleString()}
        </Typography>
      </CardContent>
    </Root>
  )
}

export default VoteCard