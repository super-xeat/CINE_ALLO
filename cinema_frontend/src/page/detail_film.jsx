
import Detail_movie from '../hook/hook_detail'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import CommentListe from '../components/commentaire_list'
import CommentForm from '../components/commentForm'
import Hook_favori from '../hook/hook_favori'
import Button from '../context/button'
import {useAuth} from  '../context/authcontext'


export default function Detail() {

    const {id} = useParams()
    const {IsAuth} = useAuth()
    const {Favori} = Hook_favori()
    const {Detail, loading, result} = Detail_movie()

    useEffect(()=> {
        Detail(id)
    }, [id])

    const handlefavori = () => (Favori(id))

    return (
        <div>
            {result && result.detail_film && (
            <>
                <h1>{result.detail_film.title}</h1>
                <p>{result.detail_film.overview}</p>
            </>)}

            {loading && <p>Chargement...</p>}
            <Button onClick={handlefavori}>Favori</Button>
            <div>
                <CommentListe/>
            </div>
            {IsAuth ? (
                <div>
                    <CommentForm/>
                </div> 
            ) : (
                <p>vous devez vous connecter pour commenter</p>
            )}          
        </div>
    )
}


