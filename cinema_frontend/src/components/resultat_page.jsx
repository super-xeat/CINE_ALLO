import { useState, useEffect } from "react"
import CardFilm from "./film_card"
import { useSearchParams } from "react-router-dom"

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
                const response = await fetch(`http://localhost:8000/api/recherche_navbar/?q=${encodeURIComponent(query)}`)
                
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
        <div>
            <h1>Résultats pour : "{query}"</h1>
            
            {result.personne && !result.personne.erreur && (
                <div>
                    <h2>Personnes</h2>
                    
                    {result.personne.actor && result.personne.actor.results && result.personne.actor.results.length > 0 && (
                        <div>
                            <h3>{result.personne.actor.results[0].name}</h3>
                        </div>
                    )}
                    
                    {result.personne.detail && (
                        <div>
                            <p>Biographie: {result.personne.detail.biography}</p>
                        </div>
                    )}
                    
                    {result.personne.filmographie && result.personne.filmographie.cast && (
                        <div>
                            <h3>Filmographie</h3>
                            {result.personne.filmographie.cast.map((item) => (
                                <CardFilm key={item.id} film={item} /> 
                            ))}
                        </div>
                    )}
                </div>
            )} 

            {result.films && !result.films.erreur && (
                <div>
                    <h2>Films</h2>
                    {result.films.film && result.films.film.results && result.films.film.results.length > 0 && (
                        <div>
                            <h3>{result.films.film.results[0].title}</h3>
                        </div>
                    )}
                    
                    {result.films.detail && (
                        <div>
                            <p>Synopsis: {result.films.detail.overview}</p>
                        </div>
                    )}
                    
                    {result.films.film_similaire && result.films.film_similaire.results && (
                        <div>
                            <h3>Films similaires</h3>
                            {result.films.film_similaire.results.map((item) => (
                                <CardFilm key={item.id} film={item} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {result.personne && result.personne.erreur && (
                <p>Aucune personne trouvée pour "{query}"</p>
            )}
            
            {result.films && result.films.erreur && (
                <p>Aucun film trouvé pour "{query}"</p>
            )}
        </div>
    )
}