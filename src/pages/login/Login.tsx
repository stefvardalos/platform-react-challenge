import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Card, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import useCatsStore from '../../cats.store.ts'

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-self: center;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => theme.spacing(4)};
  margin: auto;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    max-width: 450px;
  }
`

const SignInContainer = styled(Stack)`
  padding: 20px;
  margin-top: 10vh;
`

type Form = {
  apiKey: string
  username: string
}

const validationSchema: yup.ObjectSchema<Form> = yup.object({
  username: yup.string().required('Required'),
  apiKey: yup.string().required('Required')
})

const Login = () => {
  const [setCredentials, clearFavorites] = useCatsStore(state => [state.setCredentials, state.clearFavorites])

  const { control, handleSubmit } = useForm<Form>({
    resolver: yupResolver(validationSchema),
    defaultValues: { apiKey: '', username: '' }
  })

  const handleLogin = (data: Form) => {
    clearFavorites()
    setCredentials(data.apiKey, data.username)
  }

  const handleContinueAsGuest = () => {
    setCredentials('')
  }

  return (
    <SignInContainer>
      <StyledCard variant="outlined">
        <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(handleLogin)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2
          }}>
          <Controller
            name="username"
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <FormControl>
                <FormLabel htmlFor="username">Username</FormLabel>
                <TextField
                  placeholder="Type here"
                  fullWidth
                  variant="outlined"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  inputRef={ref}
                  {...field}
                />
              </FormControl>
            )}
          />
          <Controller
            name="apiKey"
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <FormControl>
                <FormLabel htmlFor="apikey">Api Key</FormLabel>
                <TextField
                  placeholder="Type here"
                  fullWidth
                  variant="outlined"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  inputRef={ref}
                  {...field}
                />
              </FormControl>
            )}
          />

          <Button type="submit" fullWidth variant="contained">
            Sign in
          </Button>
        </Box>
        <Divider>or</Divider>

        <Button fullWidth variant="contained" onClick={handleContinueAsGuest}>
          Continue as Guest
        </Button>
      </StyledCard>
    </SignInContainer>
  )
}

export default Login
