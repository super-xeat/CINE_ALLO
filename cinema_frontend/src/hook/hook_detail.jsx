

import { useState } from "react";


export default function Detail_movie() {

    const [loading, setloading] = useState(false)
    const [result, setresult] = useState(null)


    async function Detail(item) {
        if (!item) return

        setloading(true)

        try {
            const response = await fetch(`http://localhost:8000/api/films/detail_movie?movie_id=${encodeURIComponent(item)}`)
            const data = await response.json()
            
            setresult(data)
        } catch {
            console.log('erreur pas de films trouvé')
            setresult(null)
        } finally {
            setloading(false)
        }

    } return {Detail, loading, result}
}