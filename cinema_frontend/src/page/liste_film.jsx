
import { useState, useEffect } from "react";
import Card_film from "../components/film_card";
import Hook_favori from "../hook/hook_favori";
import Button from "../context/button"


export default function Liste_films() {

    const [liste, setliste] = useState([])
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

    return (
        <div>
            <ul>
                {liste.map((film)=>(
                    <li key={film.id}>
                        <Card_film film={film}/>
                        <Button onClick={()=>Favori(film.id)}>Ajouter au favorie</Button>
                    </li>
                ))}
            </ul>
        </div>
    )
}