import * as React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import { Box, Menu, ListItemText } from '@mui/material'; 
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Hook_favori from "../hook/hook_favori";


export default function CardFilmAccueil({ film }) {
  const { Favori, supprimer } = Hook_favori();
  const [isFav, setIsFav] = React.useState(film.favorie); 
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const Handleclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(e.currentTarget); 
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const type = film.type; 
  
  const handleFavoriClick = () => {
    if (isFav) {
      supprimer(film.id)
    } else {
      Favori(film.id);
    }
    setIsFav(!isFav)
  };

  const menuOpen = Boolean(anchorEl);

  return (
    <Box 
      sx={{
        m: { xs: 0.5, sm: 1 }, 
        border: '3px solid #0a88aeff', 
        width:'100%',
        borderRadius: 4, 
        mx: 'auto', 
        maxWidth: { xs: 180, sm: 250 } 
      }}
    >
      <Card
        sx={{
          height: '100%',
          width: '100%', 
          borderRadius: 3, 
          boxShadow: 4,
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          '&:hover': {
            transform: 'scale(1.04)', 
            boxShadow: 6, 
          }, 
        }}
      >
        <CardActionArea component={Link} to={`/detail_film/${type}/${film.id}/`}>
          <CardMedia
            component="img"
            image={
              film?.poster_path
                ? `https://image.tmdb.org/t/p/w500${film?.poster_path}/`
                : '/placeholder-poster.jpg'
            }
            alt={film.original_title}
            sx={{ objectFit: 'cover', width: '100%', height: {xs:250, sm:350}}} 
          />

          <CardContent
            sx={{
              minHeight: { sm: 140 }, 
              display: { xs: 'none', sm: 'flex' }, 
              flexDirection: 'column',
              justifyContent: 'space-between', 
              paddingBottom: 0, 
            }}
          >
            <Typography gutterBottom variant="h6" component="div"
              sx={{
                color: 'text.primary',
                textAlign: 'center',
                fontWeight: 600,
                mb: 0.5, 
                overflow: 'hidden', 
                display:'-webkit-box', 
                WebkitLineClamp:2, 
                WebkitBoxOrient: 'vertical',
            
              }}
            >
              {film.original_title}
            </Typography>

            <Typography variant="body2"
              sx={{
                color: 'text.secondary', 
                textAlign: 'justify', 
                mb: 1, 
                fontWeight: 500, 
                overflow: 'hidden', 
                display:'-webkit-box',
                WebkitLineClamp: 3, 
                WebkitBoxOrient: 'vertical'
              }}
            >
              {film.overview || 'Aucune description disponible.'}
            </Typography>      
            
            <Typography variant="subtitle2" sx={{ mt: 'auto', fontWeight: 500, textAlign: 'center', color: 'text.secondary' }}>
              Sortie : {film.release_date || 'Inconnue'}
            </Typography>
          </CardContent>
        </CardActionArea>

        <CardActions
          sx={{
            justifyContent: 'space-between', 
            alignItems: 'center',
            px: { xs:1, sm:2}, 
            pb: {xs:1, sm:2},
            mt:'auto'
          }}
        >
          <Button
            size="small"
            variant="outlined"
            color="primary"
            component={Link}
            to={`/detail_film/${type}/${film.id}/`}
            sx={{ 
              fontSize: { xs: '0.65rem', sm: '0.875rem' }, 
              px: { xs: 0.5, sm: 1 }, 
            }}
          >
            Voir plus
          </Button>

          <motion.div
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <IconButton
              onClick={handleFavoriClick}
              color={isFav ? 'error' : 'default'}
              aria-label="ajouter aux favoris"
            >
              {isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </motion.div>
        </CardActions>
        
    
        <Box 
          sx={{ 
            textAlign: 'center', mt: 0.5, pb:1,
            display: { xs: 'block', sm: 'none' } 
          }}
        >
          <IconButton 
            onClick={Handleclick}
            aria-expanded={menuOpen}
            aria-label="afficher plus"
            size="small"
            sx={{
              transition: 'transform 0.3s',
              transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} 
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ 
            '& .MuiPaper-root': { 
              maxWidth: 250, 
              maxHeight: 200, 
              overflowY: 'auto',
              p: 1,
              background:'#252424ff',
              
            }
          }}
        >
          
          <ListItemText primary={film.original_title} primaryTypographyProps={{ variant: 'subtitle1', fontWeight: 'bold', color:'#0a88aeff' }} />
          
        
          <Typography variant="body2" sx={{ mt: 1, color: '#0a88aeff' }}>
            {film.overview || 'Aucune description disponible.'}
          </Typography>
          
        
          <Typography variant="caption" sx={{ mt: 1.5, display: 'block', textAlign: 'right', color:'#0a88aeff' }}>
            Sortie : {film.release_date || 'Inconnue'}
          </Typography>
        </Menu>
      </Card>   
    </Box>
  );
}