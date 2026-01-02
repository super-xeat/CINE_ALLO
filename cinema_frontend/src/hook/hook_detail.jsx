

import { useState } from "react";


export default function Detail_movie() {

    const [loading, setloading] = useState(false)
    const [result, setresult] = useState(null)


    async function Details(item, item2) {
        if (!item || !item2) return

        setloading(true)

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/films/detail_movie/?movie_id=${encodeURIComponent(item)}&type=${item2}`)
            const data = await response.json()
            
            setresult(data)
            console.log('data_detail :', data)
        } catch {
            console.log('erreur pas de films trouvé')
            setresult(null)
        } finally {
            setloading(false)
        }

    } return {Details, loading, result}
}