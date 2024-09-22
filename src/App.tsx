import { Container, IconButton, styled, Tab, Tabs, Toolbar } from '@mui/material'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import './App.css'
import 'lazysizes'
import { Logout } from '@mui/icons-material'
import useCatsStore from './cats.store.ts'

const Root = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .app-toolbar {
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  }

  .content {
    width: 100%;
    flex-grow: 1;
    overflow: hidden;
  }

  .space {
    flex-grow: 1;
  }
`

const Home = () => {
  const location = useLocation()

  const credentials = useCatsStore(state => state.credentials)
  const isAuthenticated = !!credentials?.apiKey
  const clearCredentials = useCatsStore(state => state.clearCredentials)

  const tabsValue = location.pathname.split('/')[1] || 'login'

  return (
    <Root>
      <Toolbar className="app-toolbar" variant="dense">
        <Container maxWidth="md">
          <Tabs value={tabsValue}>
            <Tab label="Cats" component={NavLink} to="cats" value="cats" />
            <Tab label="Breeds" component={NavLink} to="breeds" value="breeds" />
            <Tab label="Favorites" component={NavLink} to="favorites" value="favorites" />
            {isAuthenticated && <Tab label="Votes" component={NavLink} to="votes" value="votes" />}
          </Tabs>
        </Container>
        <div className="space" />
        <IconButton onClick={() => clearCredentials()}>
          <Logout />
        </IconButton>
      </Toolbar>
      <div className="content">
        <Outlet />
      </div>
    </Root>
  )
}

export default Home