
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Card_film from "../components/film_card";
import Hook_favori from "../hook/hook_favori";
import Button from "../context/button";


export default function Discover() {

    const [result, setresult] = useState([])
    const [searchparams, setsearchparams] = useSearchParams()
    const [loading, setloading] = useState(false)
    const {Favori} = Hook_favori()

    const genres = searchparams.get('with_genres') || ''
    const realised_date = searchparams.get('realised_date') || ''
    
    const Decouverte = async() => {
        setloading(true)
        try {
            const response = await fetch(`http://localhost:8000/api/films/discover?${searchparams.toString()}`)
            if (!response.ok) {
                console.log('erreur dans la reponse')
            }
            const data = await response.json()
            setresult(data.liste_discover_filtre)
        } catch(error) {
            console.error('erreur de fetch', error)
        } finally {
            setloading(false)
        }
    }
    
    const handlegenre = (e) => {
        const newgenre = e.target.value
        const new_params = new URLSearchParams(searchparams)
        if (newgenre) {
            new_params.set('with_genres', newgenre)
        } else {
            new_params.delete('with_genres')
        }
        setsearchparams(new_params)
    }

    const handledate = (e) => {
        const newdate = e.target.value
        const new_params = new URLSearchParams(searchparams)
        if (newdate) {
            new_params.set('year', newdate)
        } else {
            new_params.delete('year')
        }
        setsearchparams(new_params)
    }

    useEffect(()=> {
        if (searchparams) {
            Decouverte()
        }
    }, [searchparams])
    
    return (
        <div>
            <h1>Découvrir des films</h1>
            
            <div className="filters">
                <h2>Genre</h2>
                <select onChange={handlegenre} value={genres}>
                    <option value="">Tous les genres</option>
                    <option value="28">Action</option>
                    <option value="12">Aventure</option>
                    <option value="18">Drame</option>
                    <option value="35">Comédie</option>
                    <option value="27">Horreur</option>
                    <option value="10749">Romance</option>
                    <option value="80">Policier</option>
                </select>

                <h2>Année de sortie</h2>
                <select onChange={handledate} value={realised_date}>
                    <option value="">Toutes les années</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                </select>
            </div>

            {loading && <p>Chargement...</p>}

            <div>
                {result.map((movie) => (
                    <div key={movie.id}>
                        <Card_film film={movie}/>
                        <Button onClick={()=>Favori(movie.id)}>Ajouté au favorie</Button>
                    </div>
                ))}
            </div>

        </div>
    )
}