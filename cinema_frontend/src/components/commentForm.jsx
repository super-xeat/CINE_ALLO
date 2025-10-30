
import { useState } from "react";
import Button from '../context/button'
import { useParams } from 'react-router-dom'


export default function CommentForm() {

    const [texte, settexte] = useState('')
    const {id} = useParams()

    async function Comment() {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch('http://localhost:8000/api/films/commentaires', {
                method:'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    film_id: id,
                    texte: texte
                })
            })

            const data = await response.json()
            console.log('data :', data)

        } catch(error) {
            console.error('erreur', error)
        }
    }

    const handlesubmit = (e) => (e.preventDefault(), Comment(), settexte(''))

    return(
        <div>
            <form onSubmit={handlesubmit}>
                <input type="text" onChange={(e)=>settexte(e.target.value)}
                value={texte} placeholder="entrez votre commentaire"/>
                <Button type='submit'>envoyer</Button>
            </form>
        </div>
    )
}