import * as React from 'react';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Button
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAlert } from '../context/Alertcontext';
import { useAuth } from '../context/authcontext';
import Recherche_barre from '../hook/hook_recherche';
import Hook_profil from '../hook/hook_profil';


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
  const { query, setquery } = Recherche_barre();
  const { fetchProfil, result } = Hook_profil();
  const {showSnackbar} = useAlert()


  const [mobileAnchor, setMobileAnchor] = React.useState(null); 
  const [profileAnchor, setProfileAnchor] = React.useState(null);

  const isMobileMenuOpen = Boolean(mobileAnchor);
  const isProfileMenuOpen = Boolean(profileAnchor);


  // OPEN/CLOSE MENU MOBILE
  const openMobileMenu = (e) => setMobileAnchor(e.currentTarget);
  const closeMobileMenu = () => setMobileAnchor(null);

  // OPEN/CLOSE MENU PROFIL
  const openProfileMenu = (e) => setProfileAnchor(e.currentTarget);
  const closeProfileMenu = () => setProfileAnchor(null);


  // LOGOUT
  const handleLogout = () => {
    Logout();
    closeProfileMenu();
    showSnackbar('vous etes deconnecté', 'info')
    navigate('/login');
  };


  // FORM SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/page_result?q=${encodeURIComponent(query)}`);
  };


  // LINKS
  const links = [
    { label: 'Accueil', to: '/' },
    { label: 'Liste Films', to: '/liste_films' },
    { label: 'Découverte', to: '/discover' },
    { label: 'A propos', to: '/propos' },
  ];


  useEffect(() => {
    if (IsAuth) fetchProfil();
  }, [IsAuth]);


  return (
    <Box sx={{ flexGrow: 1 }}>

      <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #0a0a0a, #1b1b1b)' }}>
        <Toolbar>

          {/* MENU MOBILE (hamburger) */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2, display: { md: 'none' } }}
            onClick={openMobileMenu}
          >
            <MenuIcon />
          </IconButton>

          {/* LOGO */}
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
              '&:hover': { color: '#0a80ff' },
            }}
          >
            🎬 CINE ALLO
          </Typography>

          
          {/* 🔎 BARRE DE RECHERCHE */}
          {location.pathname !== '/' && (
            <Search onSubmit={handleSubmit}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>

              <StyledInputBase
                type="text"
                value={query}
                onChange={(e) => setquery(e.target.value)}
              />
            </Search>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* NAVIGATION DESKTOP */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            {links.map((link) => (
              <Typography
                key={link.to}
                component={Link}
                to={link.to}
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  '&:hover': { color: '#0c90b8ff' },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Box>

          {/* AVATAR / COMPTE */}
          <IconButton color="inherit" onClick={openProfileMenu} sx={{ ml: 1 }}>
            {IsAuth && result?.image ? (
              <Avatar
                alt={result.username}
                src={result.image.startsWith('http') 
                      ? result.image 
                      : `http://localhost:8000/media/${result.image}`}
                sx={{ width: 32, height: 32 }}
              />
            ) : (
              <AccountCircle />
            )}
          </IconButton>

        </Toolbar>
      </AppBar>


      {/* 🍔 MENU MOBILE */}
      <Menu anchorEl={mobileAnchor} open={isMobileMenuOpen} onClose={closeMobileMenu}>
        {links.map((link) => (
          <MenuItem key={link.to} onClick={closeMobileMenu} component={Link} to={link.to}>
            {link.label}
          </MenuItem>
        ))}

        {IsAuth ? (
          <Box>
            <MenuItem onClick={closeMobileMenu} component={Link} to="/profile">
              Profil
            </MenuItem>
            <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
          </Box>
        ) : (
          <Box>
            <MenuItem onClick={closeMobileMenu} component={Link} to="/login">
              Connexion
            </MenuItem>
            <MenuItem onClick={closeMobileMenu} component={Link} to="/register">
              S’inscrire
            </MenuItem>
          </Box>
        )}
      </Menu>


      {/* 👤 MENU PROFIL (DESKTOP) */}
      <Menu anchorEl={profileAnchor} open={isProfileMenuOpen} onClose={closeProfileMenu}>
        {IsAuth ? (
          <Box>
            <MenuItem onClick={closeProfileMenu} component={Link} to="/profile">
              Profil
            </MenuItem>
            <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
          </Box>
        ) : (
          <Box>
            <MenuItem onClick={closeProfileMenu} component={Link} to="/login">
              Connexion
            </MenuItem>
            <MenuItem onClick={closeProfileMenu} component={Link} to="/register">
              S’inscrire
            </MenuItem>
          </Box>
        )}
      </Menu>

    </Box>
  );
}
