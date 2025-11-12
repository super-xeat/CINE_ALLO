
import { useState, useEffect } from "react";
import {useParams} from 'react-router-dom'
import CommentItem from "./commentItem";



export default function CommentListe() {

    const {id} = useParams()
    const [loading, setloading] = useState(false)
    const [liste, setliste] = useState([])


    useEffect(()=> {
        async function Liste() {
            setloading(true)
            try {
                const response = await fetch(`http://localhost:8000/api/films/commentaires?movie_id=${id}`)
                if (!response.ok) {
                    console.log('erreur de fetch')
                    alert('erreur de liste')
                }
                const data = await response.json()
                setliste(data)
                console.log('data :', data)

            } catch(error) {
                console.error('erreur', error)
            } finally {
                setloading(false)
            }
        } 
        Liste()
    }, [id])

    if (loading) return <p>chargement...</p>
    return(
        <div>
            <h1>Commentaires</h1>
            <ul>
                {liste.length !== 0  ? (liste.map((comment)=> (
                    <li key={comment.id}>
                        <CommentItem item={comment}/>
                    </li>
                ))) : (
                    <p>pas de commentaire</p>
                )}
            </ul>
        </div>
    )
}