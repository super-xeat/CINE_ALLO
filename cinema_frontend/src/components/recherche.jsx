import {Button} from "@mui/material";
import Recherche_barre from "../hook/hook_recherche";
import { useState, useEffect } from "react";
import CardFilmAccueil from "../components/film_card_accueil";
import { motion } from "framer-motion";
import { Grid, Typography, Box, InputBase } from "@mui/material"; 
import { keyframes } from "@mui/system";
import { useInView } from 'react-intersection-observer';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';


const scrollX = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const bounceInLeft = keyframes`
  from, 60%, 75%, 90%, to { animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }
  0% { opacity: 0; transform: translate3d(-3000px, 0, 0); }
  60% { opacity: 1; transform: translate3d(25px, 0, 0); }
  75% { transform: translate3d(-10px, 0, 0); }
  90% { transform: translate3d(5px, 0, 0); }
  to { transform: translate3d(0, 0, 0); }
`;

const bounceInRight = keyframes`
  from, 60%, 75%, 90%, to { animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }
  0% { opacity: 0; transform: translate3d(3000px, 0, 0); }
  60% { opacity: 1; transform: translate3d(-25px, 0, 0); }
  75% { transform: translate3d(10px, 0, 0); }
  90% { transform: translate3d(-5px, 0, 0); }
  to { transform: translate3d(0, 0, 0); }
`;

export default function Recherche() {
    const { fetch_recherche, query, setquery, result, loading } = Recherche_barre();
    const [change1, setchange1] = useState(false);
    const [change2, setchange2] = useState(false);
    const [liste, setliste] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isready, setisready] = useState(false)
    const [isready2, setisready2] = useState(false)

    const [filmMoment, setfilmMoment] = useState([])

    const gradientBG = keyframes`
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    `;

    
    const { ref, inView } = useInView({
        triggerOnce: true, 
        threshold: 0.8,
        
    });
    
    function handlesubmit(e) {
        e.preventDefault();
        fetch_recherche(query);
        setchange1(true);
        setchange2(false);
        setHasSearched(true);
    }

    async function handleproposition(params) {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/films/films/discover/?${params}`);
            const data = await response.json();

            if (data && Array.isArray(data.liste_discover_filtre)) {
                setliste(data.liste_discover_filtre);
            } else {
                setliste([]);
            }
            setchange1(false);
            setchange2(true);
            setHasSearched(true);
        } catch (error) {
            console.error('Erreur de fetch', error);
            setliste([]);
        }
    }

    useEffect(()=> {
        async function Suggestion() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/films/liste_movie/`, {
                    credentials:'include'
                })
                const data = await response.json()
                console.log('data movie :',data)
                if (data && Array.isArray(data.liste_movie)) {
                    setfilmMoment(data.liste_movie.slice(0, 18))
                    setTimeout(()=> setisready(true), 300)
                    setTimeout(()=> setisready2(true), 500)
                } 
            } catch(error) {
        console.error('erreur')
        }
        }
        Suggestion()
    }, [])

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
                    minheight: hasSearched ? 'auto' : '50vh',
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
                        placeholder="rechercher un film ou serie"
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
            
            {!hasSearched && filmMoment.length > 0 && (
            <Box sx={{width: '100%', overflow: 'hidden' }}>
                <Typography variant="h5" sx={{ mt: 7, textAlign: 'center', fontWeight:'bold' }}>Tendances</Typography>
        
                <Box sx={{    
                    width:'100%',  
                    position: 'relative',           
                    mt: 2,
                    py: 3,
                    overflowX: 'auto',

                    maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 35%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 35%, transparent)',
                }}>
                    
                <Box sx={{
                    display: 'flex',
                    width: 'max-content', 
                    animation: `${scrollX} 140s linear infinite`,
                    '&:hover': { animationPlayState: 'paused' }
                }}>               
                    {[...filmMoment, ...filmMoment].map((film, index) => (
                        <Box key={index} 
                            sx={{ width: 200, flexShrink: 0, mx: 2 }}>
                            <CardFilmAccueil film={film} />
                        </Box>                  
                    ))}
                </Box>
                
                </Box>     
                <hr /><br /><br />
                
            </Box>             
        )}

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

            {isready && 
            <Box ref={ref} sx={{ display: 'flex', justifyContent: 'flex-start',
                overflow: 'visible', width: '100%',
                WebkitMaskImage: 'linear-gradient(to left, transparent 10%, black 10%, black 80%, transparent 100%)',
                maskImage: 'linear-gradient(to left, transparent 10%, black 10%, black 80%, transparent 100%)'
            }}>
                <Box 
                sx={{
                    background: 'linear-gradient(45deg, #007bff, #0056b3)',
                    width: { xs: '70%', sm: '50%', md: '30%' },
                    maxWidth: '800px',
                    borderRadius: '0 7px 40px 0',
                    clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 0% 100%)',
                    p: 2,
                    overflow:'visible',
                    animation: inView ? `${bounceInLeft} 1s both` : 'none',
                    opacity: inView ? 1 : 0,
                    boxShadow: '10px 10px 20px rgba(0,0,0,0.1)'
                }}>
                    <Typography variant="h5" 
                    sx={{ml:'1rem', fontWeight: 600}}
                    >+ de 900 000 films !</Typography>
                </Box>
            </Box>
            }
            <br /><br />
            {isready2 && 
            <Box ref={ref} sx={{ display: 'flex', justifyContent: 'flex-end',
                overflow: 'visible', width: '100%',
                WebkitMaskImage: 'linear-gradient(to right, transparent 10%, black 10%, black 80%, transparent 100%)',
                maskImage: 'linear-gradient(to right, transparent 10%, black 10%, black 80%, transparent 100%)'
            }}>
                <Box 
                sx={{
                    background: 'linear-gradient(45deg, #007bff, #0056b3)',
                    width: { xs: '70%', sm: '50%', md: '30%' },
                    maxWidth: '800px',
                    borderRadius: '7px 0 0 20px',
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 12% 100%)',
                    p: 2,
                    overflow:'visible',
                    animation: inView ? `${bounceInRight} 1s both` : 'none',
                    opacity: inView ? 1 : 0,
                    boxShadow: '10px 10px 20px rgba(0,0,0,0.1)'
                }}>
                    <Typography variant="h5" 
                    sx={{ml:'1rem', fontWeight: 600}}
                    >+ de 150 000 séries !</Typography>
                </Box>
            </Box>
            }
            <br />
        </Box>
    );
}