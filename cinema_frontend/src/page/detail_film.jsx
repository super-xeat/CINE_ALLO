
import Detail_movie from '../hook/hook_detail'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import CommentListe from '../components/commentaire_list'
import CommentForm from '../components/commentForm'
import Hook_favori from '../hook/hook_favori'
import Button from '../context/button'
import {useAuth} from  '../context/authcontext'
import CardFilm from "../components/film_card"


export default function Detail() {

    const {id, type} = useParams()
    const {IsAuth} = useAuth()
    const {Favori} = Hook_favori()
    const {Details, loading, result} = Detail_movie()

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
        <div>
            {result && result.detail_film_serie && (
            <>
                <h1>{result.detail_film_serie.title}</h1>
                <h2>{result.detail_film_serie.tagline}</h2>_serie
                <p>{result.detail_film_serie.overview}</p>

                <img 
                        src={result.detail_film_serie.poster_path 
                            ? `https://image.tmdb.org/t/p/w500${result.detail_film_serie.poster_path}`
                            : '/placeholder-image.jpg'
                        } 
                        alt={result.detail_film_serie.title}
                        style={{width: '300px'}}
                    />

                <h2>Casting</h2>
                    <ul>
                        {result.credit_film_serie?.cast?.slice(0, 10).map((actor) => ( // ⬅️ CORRIGÉ
                            <li key={actor.id}>
                                {actor.name} - {actor.character}
                            </li>
                        ))}
                    </ul>

                <h3>Réalisateur</h3>
                    {result.credit_film_serie?.crew?.find(person => person.job === 'Director') && (
                        <p>{result.credit_film_serie.crew.find(person => person.job === 'Director').name}</p>
                    )}

                    <h3>Sortie : {result.detail_film_serie.release_date}</h3>
                    <h5>Note : {result.detail_film_serie.vote_average}/10</h5>
                    
                    <p>{result.type === 'tv' ? 'Série' : 'Films'} qui pourraient vous plaire</p>
                    <ul style={{display: 'flex', flexWrap: 'wrap', gap: '20px'}}>
                        {result.film_similaire_serie?.slice(0, 4).map((item) => (
                            <CardFilm key={item.id} film={item}/>
                        ))}
                    </ul>
            </> 
            )}

            {!loading && !result && (<p>aucun détail trouvé</p>)}
            <Button onClick={handlefavori}>❤️ Ajouter aux Favoris</Button>
            
            <div>
                <CommentListe/>
            </div>
            
            {IsAuth ? (
                <CommentForm/> 
            ) : (
                <p>Vous devez vous connecter pour commenter</p>
            )
            }      
        </div>
    )
}


