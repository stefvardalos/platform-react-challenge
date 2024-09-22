import { Masonry } from '@mui/lab'
import { Paper, paperClasses, styled } from '@mui/material'
import Button from '@mui/material/Button'
import { useInfiniteQuery } from '@tanstack/react-query'
import { CSSProperties, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { catImagesInfiniteQuery } from '../../api/cats/cats.ts'
import { Image } from '../../api/cats/types.ts'
import Loader from '../../components/Loader.tsx'
import CatInfo from './catInfo/CatInfo.tsx'

const Root = styled('div')`
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  .image-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: ${({ theme }) => theme.spacing(4)};
    gap: ${({ theme }) => theme.spacing(2)};

    .${paperClasses.root} {
      padding: 0;
      position: relative;

      &:before {
        content: '';
        display: block;
        padding-bottom: calc((var(--image-height) / var(--image-width)) * 100%);
      }
    }

    .cat-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: fill;
      border-radius: ${({ theme }) => theme.shape.borderRadius}px;
    }
  }
`

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

const CatsList = () => {
  const [urlParams, setUrlParams] = useSearchParams()

  const scrollRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(catImagesInfiniteQuery())

  const images = useMemo(() => data?.pages?.flat() || [], [data?.pages])

  const showCatInfo = (image: Image) => {
    setUrlParams({ catId: image.id })
  }

  const hideCatInfo = () => {
    setUrlParams({})
  }

  const handleFetch = async () => {
    await fetchNextPage()
    await delay(100)
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight - 100,
      behavior: 'smooth'
    })
  }

  const catId = urlParams.get('catId')

  if (isLoading) return <Loader />

  return (
    <>
      {catId && <CatInfo catId={catId} onClose={hideCatInfo} />}
      <Root ref={scrollRef}>
        <div className="image-container">
          <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
            {images.map((image: Image) => (
              <Paper
                key={image.id}
                variant="outlined"
                style={{ '--image-height': image.height, '--image-width': image.width } as CSSProperties}>
                <img
                  className="lazyload cat-image clickable-item"
                  data-src={`${image.url}?tr-w`}
                  alt={image.id}
                  onClick={() => showCatInfo(image)}
                />
              </Paper>
            ))}
          </Masonry>

          <Button variant="outlined" disabled={isFetchingNextPage} onClick={handleFetch}>
            Load More
          </Button>
        </div>
      </Root>
    </>
  )
}

export default CatsList