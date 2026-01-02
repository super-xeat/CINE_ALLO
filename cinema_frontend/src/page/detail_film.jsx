import Detail_movie from '../hook/hook_detail'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import CommentListe from '../components/commentaire_list'
import Hook_favori from '../hook/hook_favori'
import {useAuth} from  '../context/authcontext'
import CardFilm from "../components/film_card"
import { useNavigate } from 'react-router-dom'
import { Typography, Grid, CardMedia, List, ListItem, Button, Box } from '@mui/material'
import { Link } from 'react-router-dom'


export default function Detail() {

    const {id, type} = useParams()
    const {IsAuth} = useAuth()
    const {Favori} = Hook_favori()
    const {Details, loading, result} = Detail_movie()
    const navigate = useNavigate()

    const director = result?.credit_film_serie?.crew?.find(person => person.job === 'Director')

    useEffect(()=> {
        if (id && type) {
            Details(id, type)
        } 
    }, [id, type])

    const handlefavori = async () => {
        console.log('Bouton favori cliqué, ID:', id)      
        if (!id) {
            alert('ID du film non disponible')
            return
        }       
        if (!IsAuth) {
            alert('Vous devez être connecté pour ajouter aux favoris')
            return
        }
        await Favori(id, type)
    }
 
    return (
        <Box sx={{ 
            background: "linear-gradient(-45deg, #000000, #4d4c4c, #050505, #0d0d0d)",
            backgroundSize: "400% 400%",
            animation: "gradientBG 15s ease infinite",
            p: 3,
            width: '100%'
            }}>
            {result && result.detail_film_serie && (
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}
                    sx={{ border: '2px solid #0c90b8ff', borderRadius: '10px',
                        background: "linear-gradient(-45deg, #000000, #4d4c4c, #050505, #0d0d0d)",
                        backgroundSize: "400% 400%",
                        animation: "gradientBG 10s ease infinite",
                        margin: '24px',
                        p: 2
                    }}
                >
                    <Typography variant='h4' sx={{fontWeight: 'bold', color: '#0c90b8ff'}}>{result.detail_film_serie.title}</Typography>
                    <Typography variant='h6' sx={{color: '#0c90b8ff', fontWeight: 'bold'}}>{result.detail_film_serie.tagline}</Typography>
                    <Typography variant='body2' sx={{fontWeight: 'bold', color: '#0c90b8ff'}}>{result.detail_film_serie.overview}</Typography>
                    <Button onClick={handlefavori} sx={{mt: 2, border: '2px solid #0c90b8ff', '&:hover': {color: '#acbec4ff', cursor: 'pointer'} }}>❤️ Ajouter aux Favoris</Button>
                </Grid>
                
                <Grid item display={'flex'} justifyContent={'center'}>
                    <CardMedia
                        component="img"
                        image={
                            result.detail_film_serie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${result.detail_film_serie.poster_path}`
                            : '/placeholder-image.jpg'
                        }
                        alt={result.detail_film_serie.title || "Affiche indisponible"}
                        sx={{ width: 300, borderRadius: 5, border: '4px solid #0c90b8ff', ml: '20px'}}
                        />                   
                </Grid>

                <Grid>
                    <Typography variant='h5' sx={{ fontWeight: 'bold', color: '#0a88aeff' }}>
                        Casting
                    </Typography>

                    <List sx={{ p: 0 }}>
                        {result.credit_film_serie?.cast?.slice(0, 10).map((actor) => (
                            <ListItem 
                                key={actor.id} 
                                sx={{ fontWeight: 'bold', display: 'flex', gap: 1 }}
                            >
                                <Typography
                                    component={Link}
                                    to={`/page_result/?q=${encodeURIComponent(actor.name)}`}
                                    sx={{
                                        textDecoration: 'none',
                                        color: '#0a88aeff',
                                        '&:hover': {
                                        color: '#acbec4ff',
                                        cursor: 'pointer'
                                        }
                                    }}
                                >
                                    {actor.name}
                                </Typography>

                                <Typography sx={{ color: '#f5f1f1ff' }}>
                                    - {actor.character}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                </Grid>


                <Grid >
                    <Typography variant='h5' sx={{ fontWeight: 'bold', color: '#0a88aeff'}}>Réalisateur</Typography>             
                    {director ? (
                        <ListItem>
                        <Typography
                        component={Link}
                        to={`/page_result/?q=${encodeURIComponent(director.name)}`}
                        sx={{listStyle: 'None', fontWeight: 'bold', '&:hover': {color: '#acbec4ff', cursor: 'pointer'}}}
                        >
                        {director.name}
                        </Typography>
                        </ListItem>
                    ) : (
                        <p>pas de realisateur spécifié</p>
                    )}
                    <Typography sx={{marginTop: '5rem', fontWeight: 'bold', color:'#f2efef'}}>Sortie : {result.detail_film_serie.release_date}</Typography>
                    <Typography sx={{fontWeight: 'bold', color: '#f3ebebff'}}>Note : {result.detail_film_serie.vote_average} / 10</Typography>
                </Grid>
                
            </Grid>      
            )}
             
            <Typography variant='h5' sx={{color: '#0a88aeff', fontWeight: 'bold', mt: 5}}>{result && result.type === 'tv' ? 'Série' : 'Films'} qui pourraient vous plaire:</Typography>
                <ul style={{display: 'flex', flexWrap: 'wrap', gap: '20px'}}>
                    {result?.film_similaire_serie?.slice(0, 4).map((item) => (
                        <CardFilm key={item.id} film={item}/>
                    ))}
                </ul>
            {!loading && !result && (<p>aucun détail trouvé</p>)}
            
            
            <div>
                <CommentListe/>
            </div>
                
        </Box>
    )
}


