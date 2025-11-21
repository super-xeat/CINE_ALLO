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
import Hook_favori from "../hook/hook_favori";
import { Box } from '@mui/material';


export default function CardFilm({ film }) {
  const { Favori } = Hook_favori();
  const [isFav, setIsFav] = React.useState(false);

  const type = film.type

  const handleFavoriClick = () => {
    Favori(film.id);
    setIsFav(!isFav);
  };

  return (
    <Box sx={{m:1, border: '3px solid #0a88aeff', borderRadius: 3, width: 250, mx: 'auto'}}>
    <Card
      sx={{
        height: '100%',
        Width: '100%',
        borderRadius: 3,
        boxShadow: 4,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '&:hover': {
          transform: 'scale(1.04)',
          boxShadow: 6,
        }, 
      }}
    >
      <CardActionArea component={Link} to={`/detail_film/${type}/${film.id}`}>
        <CardMedia
          component="img"
          height="350"
          image={
            film?.poster_path
              ? `https://image.tmdb.org/t/p/w500${film?.poster_path}`
              : '/placeholder-poster.jpg'
          }
          alt={film.original_title}
          sx={{ objectFit: 'cover' }}
        />

        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              color: 'text.primary',
              textAlign: 'center',
              fontWeight: 600,
              mb: 1,
            }}
          >
            {film.original_title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              textAlign: 'justify',
            }}
          >
            {film.overview || 'Aucune description disponible.'}
          </Typography>

          <Typography
            variant="subtitle2"
            sx={{
              mt: 1.5,
              fontWeight: 500,
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            Sortie : {film.release_date || 'Inconnue'}
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          pb: 2,
        }}
      >
        <Button
          size="small"
          variant="outlined"
          color="primary"
          component={Link}
          to={`/detail_film/${type}/${film.id}`}
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
    </Card>
    </Box>
  );
}
