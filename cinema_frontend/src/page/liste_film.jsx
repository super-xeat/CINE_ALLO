
import { useState, useEffect } from "react";
import Card_film from "../components/film_card";
import Hook_favori from "../hook/hook_favori";
import Button from "../context/button"


export default function Liste_films() {

    const [liste, setliste] = useState([])
    const [bestnote, setbestnote] = useState([])

    const [affichage, setaffichage] = useState('populaire')
    const {Favori} = Hook_favori()


    useEffect(()=> {
        const liste_film = async()=> {
            try {
                const response = await fetch('http://localhost:8000/api/films/liste_movie')
                const data = await response.json()
                console.log(data)

                setliste(data.liste_movie)
                console.log(data)
        } catch {
            console.log('error')
        }        
        } 
        liste_film()
    }, [])

    const Best_note = async() => {
        try {
            const response = await fetch('http://localhost:8000/api/films/film_meilleur_note')

            if (!response.ok) {
                console.log('erreur pas de reponse')
            }
            const data = await response.json()
            console.log('data recu :', data)
            setbestnote(data.top_rated)

        } catch(error) {
            console.error('erreur', error)
        }
    }

    function Populaire(e) {
        e.preventDefault()
        setaffichage('populaire')
    }

    function Bestnote(e) {
        e.preventDefault()
        Best_note()
        setaffichage('meilleur_note')
    }

    return (
        <div>
            <Button onClick={Populaire}>Film populaire</Button>
            <Button onClick={Bestnote}>Meilleur note</Button>
            <ul>
                {affichage === 'populaire' && (
                    <>
                    {liste.map((film)=>(
                        <li key={film.id}>
                            <Card_film film={film}/>
                            <Button onClick={()=>Favori(film.id)}>Ajouter au favorie</Button>
                        </li>
                    ))}
                    </>
                )}  
                {affichage === 'meilleur_note' && (<>
                    {bestnote.map((film)=>(
                        <li key={film.id}>
                            <Card_film film={film}/>
                            <Button onClick={()=>Favori(film.id)}>Ajouter au favorie</Button>
                        </li>
                    ))}
                    </>
                )}
            </ul>
        </div>
    )
}