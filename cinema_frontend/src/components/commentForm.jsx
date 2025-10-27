
import { useState } from "react";
import Button from '../context/button'

export default function CommentForm() {

    const [texte, settexte] = useState('')

    async function Comment() {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch('http://localhost:8000/api/commentaires', {
                method:'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
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