import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Cardfilm from "../components/film_card";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import './discover.css'
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; 


export default function Discover() {

  const [result, setresult] = useState([]);
  const [searchparams, setsearchparams] = useSearchParams();
  const [loading, setloading] = useState(false);
  const [media, setmedia] = useState('movie')

  const [page, setpage] = useState(1)
  const [totalpage, settotalpage] = useState('')

  const genres = searchparams.get('with_genres') || '';
  const year = searchparams.get('year') || '';
  const country = searchparams.get('with_origin_country') || '';

  const Decouverte = async() => {
    setloading(true);
    
    let endpoint;

    if (media === 'movie') { 
      endpoint = `${import.meta.env.VITE_API_URL}/api/films/films/discover/`;
    } else {
      endpoint = `${import.meta.env.VITE_API_URL}/api/films/serie/discover/`;
    }

    try {
      const response = await fetch(`${endpoint}?${searchparams.toString()}&page=${page}`, {
        credentials:'include'
      });
      console.log("URL envoyée au backend :", response);
      
      if (!response.ok) {
        console.log('erreur dans la reponse')
      }
      const data = await response.json();
      setresult(data.liste_discover_filtre || []);

      if (data.total_pages) settotalpage(data.total_pages)

    } catch (error) {
      console.error('erreur de fetch', error);
    } finally {
      setloading(false);
    }
  }

  const handletruc = (event) => {
    setmedia(event.target.value);
  };

  
  const handlePageChange = (event, value) => {
    setpage(value); 
  };

  const handlegenre = (event) => {
    const newgenre = event.target.value;
    const new_params = new URLSearchParams(searchparams);
    if (newgenre) new_params.set('with_genres', newgenre);
    else new_params.delete('with_genres');
    setpage(1)
    setsearchparams(new_params);
  };

  
  const handledate = (event) => {
    const newdate = event.target.value;
    const new_params = new URLSearchParams(searchparams);
    if (newdate) new_params.set('year', newdate);
    else new_params.delete('year');
    setpage(1)
    setsearchparams(new_params);
  };

  
  const handlenote = (event) => {
    const choix = event.target.value;
    const newparams = new URLSearchParams(searchparams);
    
    newparams.delete('vote_average.gte');
    newparams.delete('vote_average.lte');
    newparams.delete('sort_by');
 
    if (choix === 'excellent') {
        newparams.set('vote_average.gte', '7');
        newparams.set('sort_by', 'vote_average.desc');
    } else if (choix === 'bon') {   
        newparams.set('vote_average.gte', '6');
        newparams.set('sort_by', 'vote_average.desc');
    } else if (choix === 'nul_culte') {
        newparams.set('vote_average.lte', '5');
        newparams.set('sort_by', 'vote_average.asc');
    } else if (choix === 'tres_mauvais') {
        newparams.set('vote_average.lte', '3');
        newparams.set('sort_by', 'vote_average.asc');
    }
    setpage(1)
    setsearchparams(newparams);
  };

  const NoteFilter = () => { 
    if (searchparams.get('vote_average.gte') === '7') return 'excellent';
    if (searchparams.get('vote_average.gte') === '6') return 'bon';
    if (searchparams.get('vote_average.lte') === '5') return 'nul_culte';
    if (searchparams.get('vote_average.lte') === '3') return 'tres_mauvais';
    return '';
  };

  const handlepays = (event) => {
    const newpays = event.target.value;
    const params = new URLSearchParams(searchparams);
    if (newpays) params.set('with_origin_country', newpays);
    else params.delete('with_origin_country');
    setpage(1)
    setsearchparams(params);
  };

  useEffect(() => {
    Decouverte();
  }, [searchparams, media, page]);

  return (
  <Container maxWidth="xl" sx={{ py: 4 }} className="discover">
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mb: 4,
      flexWrap: 'wrap',
      gap: 2
    }}>
      <Typography
      variant="h3"
      component="h1"
      sx={{
        fontWeight: "bold",
        textAlign: "center",
        background: "linear-gradient(45deg, #007bff, #0056b3)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        mb: 3, 
      }}
      >
        Découvrir des {media === "movie" ? "films" : "séries"}
      </Typography>

    </Box>

    <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3, background: "linear-gradient(135deg, #000000, #1c1c1c, #2d2d2d)", 
      border: '2px solid #0c90b8ff'
     }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: '#0c90b8ff' }}>
        Filtres de recherche
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ minWidth: 120 }} >
            <FormControl 
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#0c90b8ff',      
                },
                '&:hover fieldset': {
                  borderColor: '#0c90b8ff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0c90b8ff',       
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#0c90b8ff',               
              },
            }}>
              <InputLabel id="media-type-label" sx={{ color: '#0c90b8ff'}}>Type de contenu</InputLabel>
              <Select
                labelId="media-type-label"
                id="media-type-select"
                value={media}
                label="Type de contenu"
                onChange={handletruc}
                sx={{ color: '#0c90b8ff'}}
              >
                <MenuItem value="movie">Films</MenuItem>
                <MenuItem value="tv">Séries</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#0c90b8ff',       
                },
                '&:hover fieldset': {
                  borderColor: '#0c90b8ff',       
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0c90b8ff',       
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#0c90b8ff',              
              },
            }}>
              <InputLabel id="genre-label" sx={{ color: '#0c90b8ff'}}>Genre</InputLabel>
              <Select
                labelId="genre-label"
                id="genre-select"
                value={genres}
                label="Genre"
                onChange={handlegenre}
              >
                <MenuItem value="">Tous les genres</MenuItem>
                <MenuItem value="28">Action</MenuItem>
                <MenuItem value="12">Aventure</MenuItem>
                <MenuItem value="18">Drame</MenuItem>
                <MenuItem value="35">Comédie</MenuItem>
                <MenuItem value="27">Horreur</MenuItem>
                <MenuItem value="10749">Romance</MenuItem>
                <MenuItem value="80">Policier</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#0c90b8ff',       
                },
                '&:hover fieldset': {
                  borderColor: '#0c90b8ff',       
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0c90b8ff',       
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#0c90b8ff',              
              },
            }}>
              <InputLabel id="year-label" sx={{ color: '#0c90b8ff'}}>Année</InputLabel>
              <Select
                labelId="year-label"
                id="year-select"
                value={year}
                label="Année"
                onChange={handledate}
              
              >
                <MenuItem value="">Toutes les années</MenuItem>
                <MenuItem value="2024">2024</MenuItem>
                <MenuItem value="2023">2023</MenuItem>
                <MenuItem value="2022">2022</MenuItem>
                <MenuItem value="2021">2021</MenuItem>
                <MenuItem value="2020">2020</MenuItem>
                <MenuItem value="2019">2019</MenuItem>
                <MenuItem value="2018">2018</MenuItem>
                <MenuItem value="2017">2017</MenuItem>
                <MenuItem value="2016">2016</MenuItem>
                <MenuItem value="2015">2015</MenuItem>
                <MenuItem value="2014">2014</MenuItem>
                <MenuItem value="2013">2013</MenuItem>
                <MenuItem value="2012">2012</MenuItem>
                <MenuItem value="2011">2011</MenuItem>
                <MenuItem value="2010">2010</MenuItem>
                <MenuItem value="2009">2009</MenuItem>
                <MenuItem value="2008">2008</MenuItem>
                <MenuItem value="2007">2007</MenuItem>
                <MenuItem value="2006">2006</MenuItem>
                <MenuItem value="2005">2005</MenuItem>
                <MenuItem value="2004">2004</MenuItem>
                <MenuItem value="2003">2003</MenuItem>
                <MenuItem value="2002">2002</MenuItem>
                <MenuItem value="2001">2001</MenuItem>
                <MenuItem value="2000">2000</MenuItem>
                <MenuItem value="1999">1999</MenuItem>
                <MenuItem value="1998">1998</MenuItem>
                <MenuItem value="1997">1997</MenuItem>
                <MenuItem value="1996">1996</MenuItem>
                <MenuItem value="1995">1995</MenuItem>
                <MenuItem value="1994">1994</MenuItem>
                <MenuItem value="1993">1993</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#0c90b8ff',       
                },
                '&:hover fieldset': {
                  borderColor: '#0c90b8ff',       
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0c90b8ff',       
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#0c90b8ff',              
              },
            }}>
              <InputLabel id="note-label" sx={{ color: '#0c90b8ff'}}>Note</InputLabel>
              <Select
                labelId="note-label"
                id="note-select"
                value={NoteFilter()}
                label="Note"
                onChange={handlenote}
              >
                <MenuItem value="">Toutes notes</MenuItem>
                <MenuItem value="excellent">Excellent</MenuItem>
                <MenuItem value="bon">Bon</MenuItem>
                <MenuItem value="nul_culte">Nul mais culte</MenuItem>
                <MenuItem value="tres_mauvais">Très mauvais</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#0c90b8ff',       
                },
                '&:hover fieldset': {
                  borderColor: '#0c90b8ff',       
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0c90b8ff',       
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#0c90b8ff',              
              },
            }}>
              <InputLabel id="country-label" sx={{ color: '#0c90b8ff'}}>Pays</InputLabel>
              <Select
                labelId="country-label"
                id="country-select"
                value={country}
                label="Pays"
                onChange={handlepays}
              >
                <MenuItem value="">Tous les pays</MenuItem>
                <MenuItem value="FR">France</MenuItem>
                <MenuItem value="US">États-Unis</MenuItem>
                <MenuItem value="JP">Japon</MenuItem>
                <MenuItem value="KR">Corée du Sud</MenuItem>
                <MenuItem value="GB">Royaume-Uni</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
    </Paper>

    {loading && (
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        Chargement...
      </Alert>
    )}

    <Grid container spacing={3} justifyContent="center">
      {result.length > 0 ? (
        result.map((movie) => (
          <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
            <Cardfilm film={movie} />
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
              Aucun résultat trouvé
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Essayez de modifier vos critères de recherche
            </Typography>
          </Paper>
        </Grid>
      )}
    </Grid>
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination

              count={parseInt(totalpage) || 1} 
              page={page} 
              onChange={handlePageChange}         
              renderItem={(item) => (
                  <PaginationItem
                      sx={{color: "#f6ededff", '&.Mui-selected': { 
                      backgroundColor: '#0a88aeff', 
                      color: '#fff'}}}
                      slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                      {...item}
                  />
              )}
          />
      </Box>
  </Container>
)
    
}

