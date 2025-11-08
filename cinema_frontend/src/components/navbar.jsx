import * as React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from '../context/authcontext';
import Button from '../context/button';
import Recherche_barre from '../hook/hook_recherche';


const Search = styled('form')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(3),
  width: 'auto',
  transition: 'width 0.3s ease',
  [theme.breakpoints.up('sm')]: {
    width: '25ch',
    '&:hover': { width: '30ch' },
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled('input')(({ theme }) => ({
  color: 'inherit',
  background: 'transparent',
  border: 'none',
  outline: 'none',
  padding: theme.spacing(1, 1, 1, 0),
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  width: '100%',
  fontSize: '1rem',
}));

export default function Navbar() {
  const { IsAuth, Logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { fetch_recherche, query, setquery } = Recherche_barre();


  const [mobileAnchor, setMobileAnchor] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileAnchor);

  const [profileAnchor, setProfileAnchor] = React.useState(null);
  const isProfileMenuOpen = Boolean(profileAnchor);

  const handleMobileMenuOpen = (event) => setMobileAnchor(event.currentTarget);
  const handleMobileMenuClose = () => setMobileAnchor(null);

  const handleProfileMenuOpen = (event) => setProfileAnchor(event.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchor(null);

  const handleLogout = () => {
    Logout();
    navigate(-1);
  };

  function handleSubmit(e) {
      e.preventDefault()
      navigate(`/page_result?q=${encodeURIComponent(query)}`)
    }

  const links = [
    { label: 'Accueil', to: '/' },
    { label: 'Liste Films', to: '/liste_films' },
    { label: 'Découverte', to: '/discover' },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(90deg, #0a0a0a, #1b1b1b)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { md: 'none' } }}
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              color: 'white',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              '&:hover': { color: '#0a1c80ff' },
            }}
          >
            🎬 CINE ALLO
          </Typography>

          {location.pathname !== '/' && (
            <Search onSubmit={handleSubmit}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                type="text"
                value={query}
                onChange={(e) => setquery(e.target.value)}
                placeholder="Rechercher un film..."
              />
            </Search>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            {links.map((link) => (
              <Typography
                key={link.to}
                component={Link}
                to={link.to}
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': { color: '#0a1c80ff' },
                }}
              >
                {link.label}
              </Typography>
            ))}

            {IsAuth ? (
              <>
                <Typography
                  component={Link}
                  to="/profile"
                  sx={{
                    color: 'white',
                    textDecoration: 'none',
                    '&:hover': { color: '#0a1c80ff' },
                  }}
                >
                  Profil
                </Typography>
                <Button onClick={handleLogout}>Déconnexion</Button>
              </>
            ) : (
              <>
                <Typography
                  component={Link}
                  to="/login"
                  sx={{
                    color: 'white',
                    textDecoration: 'none',
                    '&:hover': { color: '#0a1c80ff' },
                  }}
                >
                  Connexion
                </Typography>
                <Typography
                  component={Link}
                  to="/register"
                  sx={{
                    color: 'white',
                    textDecoration: 'none',
                    '&:hover': { color: '#0a1c80ff' },
                  }}
                >
                  S’inscrire
                </Typography>
              </>
            )}
          </Box>

          <IconButton
            size="large"
            color="inherit"
            onClick={handleProfileMenuOpen}
            sx={{ ml: 1 }}
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={mobileAnchor}
        id="menu-mobile"
        keepMounted
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {links.map((link) => (
          <MenuItem
            key={link.to}
            onClick={handleMobileMenuClose}
            component={Link}
            to={link.to}
          >
            {link.label}
          </MenuItem>
        ))}
        {IsAuth
          ? [
              <MenuItem key="profile" component={Link} to="/profile">
                Profil
              </MenuItem>,
              <MenuItem key="logout" onClick={handleLogout}>
                Déconnexion
              </MenuItem>,
            ]
          : [
              <MenuItem key="login" component={Link} to="/login">
                Connexion
              </MenuItem>,
              <MenuItem key="register" component={Link} to="/register">
                S’inscrire
              </MenuItem>,
            ]}
      </Menu>

      <Menu
        anchorEl={profileAnchor}
        id="menu-profile"
        keepMounted
        open={isProfileMenuOpen}
        onClose={handleProfileMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleProfileMenuClose} component={Link} to="/profile">
          Profil
        </MenuItem>
        <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
      </Menu>
    </Box>
  );
}
