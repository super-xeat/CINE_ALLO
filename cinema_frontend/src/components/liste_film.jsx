
import { useState, useEffect } from "react";
import Card_film from "./film_card";


export default function Liste_films() {


    const [liste, setliste] = useState([])

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
                    </li>
                ))}
            </ul>
        </div>
    )
}