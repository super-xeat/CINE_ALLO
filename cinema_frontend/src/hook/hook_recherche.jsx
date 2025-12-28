

import { useState } from "react";


export default function Recherche_barre() {

    const [query, setquery] = useState('')
    const [result, setresult] = useState([])
    const [loading, setloading] = useState(false)
   
    const fetch_recherche = async(item) => {
        if (!item) return
        setloading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/recommandation?q=${encodeURIComponent(item)}`)
            const data = await response.json()

            setresult(data)
            console.log(data)
        } catch {
            setresult([])
        } finally {
            setloading(false)
        }
    } 
    return { query, loading, setquery, result, fetch_recherche}
    
}