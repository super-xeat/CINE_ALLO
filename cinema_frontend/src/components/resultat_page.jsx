import { useState, useEffect } from "react"
import CardFilm from "./film_card"
import { useSearchParams } from "react-router-dom"
import { Grid, Box, Typography, CardMedia } from "@mui/material"


export default function Page_result() {
    const [result, setResult] = useState({ personne: {}, films: {} }) 
    const [loading, setLoading] = useState(false)
    const [searchParams] = useSearchParams() 
    const query = searchParams.get('q') || ''

    useEffect(() => {
        async function fetch_Pageresult() {
            if (!query) return 
            
            setLoading(true)
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/recherche_navbar/?q=${encodeURIComponent(query)}`)
                
                if (!response.ok) {
                    console.log('erreur de response')
                    return
                }
                
                const data = await response.json()
                setResult(data)
                
            } catch (error) {
                console.error('erreur de recherche navbar', error)
            } finally {
                setLoading(false)
            }
        }
        fetch_Pageresult()
    }, [query]) 

    if (loading) return <p>Chargement ...</p>

    return(
        <Box 

        sx={{ 
            background: "linear-gradient(-45deg, #000000, #4d4c4c, #050505, #0d0d0d)",
            backgroundSize: "400% 400%",
            animation: "gradientBG 15s ease infinite",
            p: 3,
            width: '100%'
            }}>
            <Typography variant="h4" sx={{fontWeight: 'bold', color: '#0c90b8ff', mb: 3}}>Résultats pour : "{query}"</Typography>
            
            {result?.personne && !result.personne.erreur && (
                <Box>
                    <Box sx={{background:'#656363ff', p:4, borderRadius:10, border: '2px solid #0c90b8ff'}}>
                        <Grid container spacing={3} justifyContent={'center'}>
                                
                            <Grid item>
                                
                                <CardMedia
                                    component='img'
                                    image={result?.personne?.detail?.profile_path                         
                                        ? `https://image.tmdb.org/t/p/w500${result?.personne?.detail?.profile_path}`
                                        : <Typography>pas d'image</Typography>
                                    } 
                                    sx={{width: 300, borderRadius: 5, border: '2px solid #0c90b8ff'}}
                                />
                                
                            </Grid>
                        </Grid>
                            
                           
                        <Box sx={{mb:2, mt:2}}>
                            {result.personne.detail?.place_of_birth && (
                            <Typography variant="h7"sx={{fontWeight:'bold'}}>
                                <Typography variant="h5"sx={{fontWeight:'bold'}}>Lieu de naissance :</Typography> 
                                    {result.personne.detail.place_of_birth}
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{mb:2}}>
                            {result.personne.detail?.birthday && (
                            <Typography variant="h7"sx={{fontWeight:'bold'}}>
                                <Typography variant="h5"sx={{fontWeight:'bold'}}>Date de naissance :</Typography> 
                                    {result.personne.detail.birthday}
                                </Typography>
                            )}
                        </Box>
                    
                    
                        {result.personne.detail?.biography && (
                            <Box>
                                <Typography variant="h5" sx={{fontWeight: 'bold'}}>Biographie</Typography>
                                <Typography>{result.personne.detail.biography}</Typography>
                            </Box>
                        )}
                    </Box>
                            
                                     
                    {result.personne.top_filmographie && (
                        <Box>
                            <Typography variant="h5" sx={{mb:4, mt:4, color:'#0c90b8ff'}}>Top Films/Séries :</Typography>
                            <Grid container spacing={3} justifyContent="center"> 
                            {result.personne.top_filmographie.map((item) => (
                                <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}> 
                                    <Box sx={{mb:5, display: 'flex', justifyContent: 'center'}}> 
                                        <CardFilm film={item} />
                                    </Box>
                                </Grid>
                            ))}
                            </Grid>
                        </Box>
                    )}
                </Box>
            )} 

            {result.films && !result.films.erreur && (
                <Box sx={{ flexGrow: 1, p: 2 }}>
                    <Grid container spacing={4}>
                        
                        <Grid item xs={12}>
                            <Typography variant='h4' sx={{ color: '#dad7d7ff', fontWeight: '800', mb: 2 }}>
                                {result.films?.detail?.title}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={5} lg={4}>
                            <CardMedia
                                component='img'
                                image={result.films.detail?.poster_path 
                                    ? `https://image.tmdb.org/t/p/w500${result.films.detail.poster_path}`
                                    : "https://via.placeholder.com/500x750?text=Image+non+disponible"
                                }
                                alt={result.films?.detail?.title}
                                sx={{ 
                                    maxWidth: 400, 
                                    width: '100%', 
                                    borderRadius: 5, 
                                    border: '2px solid #0c90b8ff',
                                    boxShadow: '0px 4px 20px rgba(0,0,0,0.5)'
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={7} lg={8}>
                            {result.films.detail?.overview && (
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant='h6' sx={{ color: '#d7d3d3ff', fontWeight: '800', mb: 1 }}>
                                        Synopsis
                                    </Typography>
                                    <Typography variant='body1' sx={{ color: '#d9d6d6ff', lineHeight: 1.6, textAlign: 'justify' }}>
                                        {result.films.detail.overview}
                                    </Typography>
                                </Box>
                            )}

                            {result.films.film_similaire?.results?.length > 0 && (
                                <Box sx={{ mt: 4 }}>
                                    <Typography variant='h5' sx={{ color: '#dad7d7ff', fontWeight: '700', mb: 2 }}>
                                        Films similaires
                                    </Typography>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexWrap: 'wrap', 
                                        gap: 2 
                                    }}>
                                        {result.films.film_similaire.results.slice(0, 4).map((item) => (
                                            <CardFilm key={item.id} film={item} />
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Grid>

                    </Grid>
                </Box>
            )}

            {result.personne && result.personne.erreur && (
                <div>
                    <p>Aucune personne trouvée pour "{query}"</p>
                </div>
            )}
            
            {result.films && result.films.erreur && (
                <div>
                    <p>Aucun film trouvée pour "{query}"</p>
                </div>
            )}
        </Box>
    )
}