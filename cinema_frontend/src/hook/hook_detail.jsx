

import { useState } from "react";


export default function Detail_movie() {

    const [loading, setloading] = useState(false)
    const [result, setresult] = useState([])
    const [query, setquery] = useState('')


    async function Detail(item) {
        if (!item) return

        setloading(true)

        try {
            const response = await fetch(`http://localhost:8000/api/films/movie?movie_id=${encodeURIComponent(item)}`)
            const data = await response.json()
            
            setresult(data)
        } catch {
            console.log('erreur pas de films trouvé')
            setresult([])
        } finally {
            setloading(false)
        }

    } return {Detail, loading, result, query, setquery}
}