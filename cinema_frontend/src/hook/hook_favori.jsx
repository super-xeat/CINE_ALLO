
import { useState } from "react";


export default function Hook_favori() {
    
    const [loading, setloading] = useState(false)
    
    async function Favori(id) {
        
        const response = await fetch('http://localhost:8000/auth/ajout_film', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                tmdb_id: id
            })
            
        })
        const data = await response.json()
        if (response.ok) {
            alert('film ajouté au favori')
            console.log('film ajouté au favori', response.status)
        } else {
            alert('erreur')
        }
    }

    return {Favori}

}