import { useState, useEffect } from "react"

export default function Card_favori({tmdb_id, statutActuel, liste}) {

    const [loading, setloading] = useState(false)
    const [film, setfilm] = useState(null)
    const [statut, setstatut] = useState(statutActuel) 

    useEffect(()=> {
        async function Prendre_Film_tmdb() {
            setloading(true)
            try {
                const response = await fetch(`http://localhost:8000/auth/recup_film/${tmdb_id}`)
                if (!response.ok) {
                    return
                }
                const data = await response.json()
                setfilm(data)
            } catch(error) {
                console.log('erreur dans la demande de film tmdb', error)
            } finally {
                setloading(false)
            }        
        }
        Prendre_Film_tmdb()
        }, [tmdb_id])

    const modify_statut = async(newstatu) => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`http://localhost:8000/auth/modifier/${tmdb_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({'statut': newstatu})
            })
            if (!response.ok) {
                console.log('erreur de put', response.status)
                return
            }
            setstatut(newstatu)
            liste()
        } catch(error) {
            console.log('modification impossible', error)
        }
    }

    if (!film) return <p>Film non trouvé</p>
    if (loading) return <p>Chargement...</p>

    return (
        <div>
            <img src={film.image} alt={film.titre} />
            <h3>{film.titre}</h3>
            <p>{film.synopsis}</p>
            <p>{statutActuel}</p>
            <select 
                value={statut} 
                onChange={(e) => modify_statut(e.target.value)} 
            >
                <option value="VOIR">à voir</option>
                <option value="VU">vu</option>
                <option value="FAVORI">favori</option>
            </select>
            
        </div>
    )
}