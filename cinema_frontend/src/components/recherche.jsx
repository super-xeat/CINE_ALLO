import {Button} from "@mui/material";
import Recherche_barre from "../hook/hook_recherche";
import { useState } from "react";
import CardFilmAccueil from "../components/film_card_accueil";
import { color, motion } from "framer-motion";
import { Grid, Typography, Box, InputBase } from "@mui/material"; 
import { borderRadius, fontWeight, keyframes, margin, padding } from '@mui/system'; 
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';

const gradientBG = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;

export default function Recherche() {
    const { fetch_recherche, query, setquery, result, loading } = Recherche_barre();
    const [change1, setchange1] = useState(false);
    const [change2, setchange2] = useState(false);
    const [liste, setliste] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);


    function handlesubmit(e) {
        e.preventDefault();
        fetch_recherche(query);
        setchange1(true);
        setchange2(false);
        setHasSearched(true);
    }

    async function handleproposition(params) {
        try {
            const response = await fetch(`http://localhost:8000/api/films/films/discover?${params}`);
            const data = await response.json();
            setliste(data.liste_discover_filtre || []);
            setchange1(false);
            setchange2(true);
            setHasSearched(true);
        } catch (error) {
            console.error('Erreur de fetch', error);
            setliste([]);
        }
    }

    const styleButton = {
        background: 'linear-gradient(45deg, #007bff, #0056b3)',
        color:'white',
        padding:'12px 14px',
        borderRadius:'25px',
        fontWeight:'bold',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxshadow: '0 6px 15px rgba(0, 123, 255, 0.3)',
            background: 'linear-gradient(45deg, #0056b3, #004494)',
        },
              
    }
    return ( 
        
        <Box 
            sx={{
                width: '100vw',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#fff',
                boxSizing: 'border-box',
                background: 'linear-gradient(-45deg, #000000, #4d4c4c, #050505, #0d0d0d)',
                backgroundSize: '400% 400%',
                animation: `${gradientBG} 15s ease infinite`,
            
                padding: { xs: '1rem', sm: '2rem' }, 
                pt: hasSearched ? '1rem' : { xs: '1rem', sm: '2rem' },
            }}>
            <Box 
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'all 0.5s ease',
                    justifyContent: hasSearched ? 'flex-start' : 'center',
                    height: hasSearched ? 'auto' : '70vh',
                    marginBottom: hasSearched ? '2rem' : 0,
                }}>
                <Box component="form" onSubmit={handlesubmit} 
                    sx={{
                        width: { xs: '95%', sm: '100%' }, 
                        maxWidth: 600,
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 2,
                    }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 3 }}>
                    <InputBase
                        value={query}
                        onChange={(e) => setquery(e.target.value)}
                        sx={{
                            width: { 
                                xs: '80%', 
                                sm: '500px', 
                                md: '600px' 
                            },
                            height: {xs:'80%', sm:'70%'},
                            padding: { xs: '10px 45px 10px 15px', sm: '15px 60px 15px 20px' },
                            fontSize: { xs: '0.9rem', sm: '1.1rem' },
                            borderRadius: '50px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            color: 'white',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.3s ease-in-out',
                            
        
                            '&:hover': {
                                width: { 
                                    xs: '85%', 
                                    sm: '550px', 
                                    md: '650px' 
                                },
                                background: 'rgba(255, 255, 255, 0.15)',
                                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
                                borderColor: 'rgba(255, 255, 255, 0.4)',
                            },
                
                        }}
                    />
                </Box>                      
                </Box>
                <Box className="suggestions" sx={{ display: 'flex',
                    flexWrap: 'wrap', gap: 2, 
                    justifyContent: 'center', mt: 2, maxWidth: 800, transition: 'all 0.5s ease',
                
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'center', sm: 'initial' },
                    width: { xs: '100%', sm: 'auto' },
                    
                    '& > button': {
                        borderRadius: '25px',
                        padding: { xs: '10px 20px', sm: '12px 24px' },
                        fontSize: { xs: '0.9rem', sm: '1rem' }, 
                        width: { xs: '100%', sm: 'auto' }, 
                        maxWidth: { xs: 300, sm: 'none' },
                        
                        background: 'linear-gradient(45deg, #007bff, #0056b3)',
                        border: 'none',
                        color: 'white',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',

                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 15px rgba(0, 123, 255, 0.3)',
                            background: 'linear-gradient(45deg, #0056b3, #004494)',
                        },

                        
                    },
                }}>
                    <Box sx={{
                        display:'flex',
                        flexWrap:'wrap',
                        justifyContent:'center',
                        gap:'10px',
                        margin:'20px auto',
                        marginLeft:'5%',
                        marginRight: '5%',

                        maxHeight: '300px',
                        overflowY:'auto',
                        overflowX:'hidden',

                        '&::-webkit-scrollbar-track': {
                            background: 'rgba(255, 255, 255, 0.05)', 
                            borderRadius: '10px',
                        },
                        '&::-webkit-scrollbar': {
                            width: '10px', 
                        },
                        
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(255, 255, 255, 0.3)', 
                            borderRadius: '10px',
                            border: '2px solid transparent', 
                        },
                        
                        '&::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: '#190ee4ff', 
                        },    
                    }}>
                        
                        <Button sx={styleButton} onClick={() => handleproposition("with_genres=28&year=2000&with_origin_country=US")}>Meilleur action années 2000</Button>
                        <Button sx={styleButton} onClick={() => handleproposition("with_genres=9648,80&sort_by=revenue.desc")}>Mystères/Polars Célèbres</Button>
                        <Button sx={styleButton} onClick={() => handleproposition("with_genres=16&with_origin_country=JP")}>Animés Japonais</Button>
                        <Button sx={styleButton} onClick={() => handleproposition("with_genres=10749&with_origin_country=US")}>Comédies romantiques</Button>
                        <Button sx={styleButton} onClick={() => handleproposition("with_genres=10752&with_origin_country=US")}>Films de guerre</Button>
                        <Button sx={styleButton} onClick={() => handleproposition("with_genres=35&year=1980&with_origin_country=US")}>Meilleur comédies des années 80</Button>
                        <Button sx={styleButton} onClick={() => handleproposition("with_genres=27&year_gte=2000&with_origin_country=US")}>Meilleur films horreur des 20 dernières années</Button>
                        <Button sx={styleButton} onClick={() => handleproposition("with_genres=10402&year=1980&with_origin_country=US")}>Comédies musicales 80s</Button>
                        <Button sx={styleButton} onClick={() => handleproposition("with_genres=35&with_origin_country=FR")}>Comédies Françaises</Button>
                        <Button sx={styleButton} onClick={() => handleproposition("with_genres=80&with_origin_country=KR")}>Thrillers Sud-Coréens</Button>
                        <Button sx={styleButton} onClick={() => handleproposition("with_genres=10752&with_origin_country=US")}>Films de Guerre Épiques</Button>
                        <Button sx={styleButton} onClick={() => handleproposition("with_genres=10751&sort_by=vote_average.desc&vote_count.gte=100")}>Films Familiaux Bien Notés</Button>
                        <Button sx={styleButton} onClick={() => handleproposition("with_genres=14,10749")}>Fantasy Romantique</Button>
                        <Button sx={styleButton} onClick={() => handleproposition("with_genres=27&vote_average.lte=5")}>Soirée Nanars Horrifiques</Button>
                    </Box>
                </Box>
            </Box>

            {loading && <Typography variant="body1">Chargement...</Typography>}

            <Grid container spacing={2} justifyContent="center" sx={{ 
                mt: 3,
                width: { xs: '100%', sm: '90%' },
                maxWidth: 1000}}>
                               
                {change1 && result?.result_film?.film_similaire?.map((film, index) => (
                    <Grid key={film.id} item xs={6} sm={4} md={3} lg={2}> 
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <CardFilmAccueil film={film} horizontal />
                        </motion.div>
                    </Grid>
                ))}

                {change1 && result?.result_film?.film_recommande?.map((film, index) => (
                    <Grid key={film.id} item xs={6} sm={4} md={3} lg={2}>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <CardFilmAccueil film={film} horizontal />
                        </motion.div>
                    </Grid>
                ))}

                {change1 && result?.result_serie?.serie_recommandation?.map((film, index) => (
                    // La taille ci-dessous était très grande (xs=12, md=8). 
                    // Je suppose que vous vouliez les mêmes cartes. Ajusté pour correspondre.
                    <Grid key={film.id} item xs={6} sm={4} md={3} lg={2}>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <CardFilmAccueil film={film} horizontal />
                        </motion.div>
                    </Grid>
                ))}

                {change1 && result?.result_serie?.serie_similaire?.map((film, index) => (
                    <Grid key={film.id} item xs={6} sm={4} md={3} lg={2}>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <CardFilmAccueil film={film} horizontal />
                        </motion.div>
                    </Grid>
                ))}

                {change2 && liste?.map((film, index) => (
                    <Grid key={film.id} item xs={6} sm={4} md={3} lg={2}>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <CardFilmAccueil film={film} horizontal />
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}