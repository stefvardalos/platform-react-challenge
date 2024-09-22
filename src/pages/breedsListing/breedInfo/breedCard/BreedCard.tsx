import { AvTimer, Bolt, ChildCare, Map, MonitorWeight, Pets } from '@mui/icons-material'
import {
  Avatar,
  CardActions,
  cardActionsClasses,
  CardContent,
  cardContentClasses,
  ImageList,
  ImageListItem,
  List,
  listClasses,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  PaperProps,
  styled,
  Typography
} from '@mui/material'
import Button from '@mui/material/Button'
import { blue, green, red } from '@mui/material/colors'
import Grid from '@mui/material/Grid2'
import { Link } from 'react-router-dom'
import { Breed } from '../../../../api/breeds/types.ts'
import { Image } from '../../../../api/cats/types.ts'
import BreedImage from '../../BreedImage.tsx'

type Props = {
  breed: Breed
  breedCats: Image[]
  type: 'modal' | 'paper'
}

const Root = styled(Paper)<{ type: Props['type'] } & PaperProps>`
  width: 100%;
  min-width: ${({ type }) => (type === 'modal' ? `min(90vw, 580px)` : `180px`)};
  overflow: hidden;

  .${listClasses.root} {
    background-color: ${({ theme }) => theme.palette.background.paper};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  }

  .${cardContentClasses.root} {
    padding: ${({ theme }) => theme.spacing(2, 3)};
  }

  .${cardActionsClasses.root} {
    justify-content: space-between;
    padding: ${({ theme }) => theme.spacing(2, 3)};
  }

  .image-list {
  }
`

const pickColor = (number: number) => {
  if (number < 2) {
    return red[500]
  } else if (number > 3) {
    return green[500]
  } else {
    return blue[500]
  }
}

const BreedCard = ({ breed, breedCats, type }: Props) => {
  const openLink = (link: string) => {
    window.open(link, '_blank')
  }

  return (
    <Root type={type} variant="outlined">
      {!breedCats.length && <BreedImage breed={breed} />}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {breed.name}
        </Typography>
        <Grid container spacing={2}>
          <Grid size={6}>
            <List>
              <ListItem key="child_friendly">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: pickColor(breed.child_friendly) }}>
                    <ChildCare />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Child Friendly" secondary={`${breed.child_friendly} / 5`} />
              </ListItem>
              <ListItem key="dog_friendly">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: pickColor(breed.dog_friendly) }}>
                    <Pets />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Dog Friendly" secondary={`${breed.dog_friendly} / 5`} />
              </ListItem>
              <ListItem key="energy_level">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: pickColor(breed.energy_level) }}>
                    <Bolt />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Energy Level" secondary={`${breed.energy_level} / 5`} />
              </ListItem>
            </List>
          </Grid>
          <Grid size={6}>
            <List>
              <ListItem key="weight">
                <ListItemAvatar>
                  <Avatar>
                    <MonitorWeight />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary=" Weight" secondary={`${breed.weight.metric} Kg`} />
              </ListItem>
              <ListItem key="origin">
                <ListItemAvatar>
                  <Avatar>
                    <Map />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Origin" secondary={`${breed.origin}`} />
              </ListItem>
              <ListItem key="energy">
                <ListItemAvatar>
                  <Avatar>
                    <AvTimer />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Energy Level" secondary={`${breed.life_span} Years`} />
              </ListItem>
            </List>
          </Grid>

          {breedCats.length ? (
            <Grid size={12} className="image-list">
              <ImageList cols={4}>
                {breedCats.map(item => (
                  <ImageListItem key={item.url} component={Link} to={'/cats?catId=' + item.id}>
                    <img
                      srcSet={`${item.url}?w=100%&h=100%&fit=contain`}
                      src={`${item.url}?w=100%&h=100%&fit=contain`}
                      alt={item.id}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>
          ) : null}
        </Grid>
      </CardContent>
      <CardActions>
        <Button onClick={() => openLink(breed.vetstreet_url)} disabled={!breed.vetstreet_url}>
          Read More on VetStreet
        </Button>
        <Button onClick={() => openLink(breed.wikipedia_url)} disabled={!breed.wikipedia_url}>
          Search on Wikipedia
        </Button>
      </CardActions>
    </Root>
  )
}

export default BreedCard
