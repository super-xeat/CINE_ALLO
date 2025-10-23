

import Detail_movie from '../hook/hook_detail'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'


export default function Detail() {

    const {id} = useParams()
    const {Detail, loading, result} = Detail_movie()

    useEffect(()=> {
        Detail(id)
    }, [id])

    return (
        <div>
            {result && result.detail_film && (
            <>
                <h1>{result.detail_film.title}</h1>
                <p>{result.detail_film.overview}</p>
            </>)}

            {loading && <p>Chargement...</p>}
        </div>
    )
}


