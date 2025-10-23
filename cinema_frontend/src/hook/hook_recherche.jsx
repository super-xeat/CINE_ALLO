

import { useState } from "react";


export default function Recherche_barre() {

    const [query, setquery] = useState('')
    const [result, setresult] = useState([])
    const [loading, setloading] = useState(false)

    
    const fetch_recherche = async(item) => {
        if (!item) return
        console.log('item :', item)
        setloading(true)
        try {
            const response = await fetch(`http://localhost:8000/api/recommandation?q=${encodeURIComponent(item)}`)
            const data = await response.json()

            setresult(data)
            console.log(data)
        } catch {
            console.log('erreur pas de data')
            setresult([])
        } finally {
            setloading(false)
        }
    } 
    return { query, loading, setquery, result, fetch_recherche}
    
}