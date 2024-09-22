import { styled, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { votesQuery } from '../../api/votes/votes.ts'
import Loader from '../../components/Loader.tsx'
import VoteCard from './voteCard/VoteCard.tsx'

const Root = styled('div')`
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;

  .votes-container {
    padding: ${({ theme }) => theme.spacing(4)};
  }

  .vote-item {
    display: flex;
    justify-content: center;
  }

  .vote-details {
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

const Votes = () => {
  const { data, isLoading, isError, error } = useQuery(votesQuery())

  const votes = useMemo(() => data || [], [data])

  if (isLoading) return <Loader />
  if (isError) return <div>{error.message}</div>

  return (
    <Root>
      <div className="votes-container" aria-label="votes">
        <Typography gutterBottom variant="h5" component="div">
          Newest Votes
        </Typography>
        {votes.length === 0 && (
          <Typography gutterBottom variant="h6" component="div">
            There are no votes yet!
          </Typography>
        )}
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {votes &&
            votes.map(vote => (
              <Grid key={vote.id} size={{ xs: 2, sm: 4, md: 3 }}>
                <VoteCard vote={vote} />
              </Grid>
            ))}
        </Grid>
      </div>
    </Root>
  )
}

export default Votes