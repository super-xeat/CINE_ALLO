
import { Box, Container, Typography, Grid, Link, IconButton } from "@mui/material";
import XIcon from '@mui/icons-material/X'; 
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  const footerBgColor = '#212121'; 

  return (
    <Box 
      component="footer" 
      sx={{ 
        zindex:1000,
        bgcolor: footerBgColor,
        color: 'white',          
        py: 6,          
        mt: 'auto',              
        width: '100%',
        
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          
          <Grid item xs={12} sm={4}>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ fontWeight: 'bold', color: 'primary.light' }} 
            >
              CINE ALLO
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Découvrez les meilleurs films et séries grâce à l’API The Movie Database.
            </Typography>
          </Grid>

          <Grid item xs={6} sm={4}>
            <Typography variant="h6" gutterBottom sx={{color:'primary.light', fontWeight:'bold'}}>
              Navigation
            </Typography>
            <Box>
              <Link href="/" color="inherit" display="block" underline="hover" sx={{ mb: 0.5 }}>
                <Typography sx={{fontWeight:'bold'}}>Accueil</Typography>
              </Link>
              <Link href="/Propos" color="inherit" display="block" underline="hover" sx={{ mb: 0.5 }}>
                <Typography sx={{fontWeight:'bold'}}>A propos</Typography>
              </Link>
              <Link href="/contact" color="inherit" display="block" underline="hover">
                <Typography sx={{fontWeight:'bold'}}>Contact</Typography>
              </Link>
            </Box>
          </Grid>

          <Grid item xs={6} sm={4} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="h6" gutterBottom sx={{color: 'primary.light', fontWeight:'bold'}}>
              Suivez-nous
            </Typography>
            <Box className="social-icons" sx={{ '& a': { color: 'inherit' } }}>
              
              <IconButton 
                href="https://x.com" 
                target="_blank" 
                rel="noreferrer" 
                color="inherit" 
                sx={{ mr: 1.5 }}
              >
                <XIcon />
              </IconButton>
              
              <IconButton 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                color="inherit" 
                sx={{ mr: 1.5 }}
              >
                <FacebookIcon />
              </IconButton>
              
              
              <IconButton 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                color="inherit"
              >
                <LinkedInIcon />
              </IconButton>
              
            </Box>
          </Grid>

        </Grid>
        <Box 
          className="footer-bottom" 
          sx={{ 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
            mt: 6, 
            pt: 3 
          }}
        >
          <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} TMDb Explorer. Tous droits réservés.
          </Typography>
        </Box>
        
      </Container>
    </Box>
  );
};

export default Footer;