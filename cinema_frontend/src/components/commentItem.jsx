import { Box, Typography } from "@mui/material";
import { useState } from "react";
import {Button} from "@mui/material";
import { useAuth } from "../context/authcontext";
import useToken from "../hook/hook_token";


export default function CommentItem({item, Refresh}) {

    console.log('item :', item)
    
    const [loading, setloading] = useState(false)
    const [newtexte, setnewtexte] = useState('')
    const {IsAuth, userauth} = useAuth()
    const [cache, setcache] = useState(false)
    const {Refresh_token} = useToken()


    const Like = async(commentId) => {
    
        setloading(true)
        try {
            let response = await fetch(`http://localhost:8000/api/films/commentaires/${commentId}/like`,{
                method: 'POST',
                credentials:'include'
            })
            await response.json()
            if (response.status === 401) {
                const newtoken = await Refresh_token()

                if (newtoken) {
                    response = await fetch(`http://localhost:8000/api/films/commentaires/${commentId}/like`,{
                    method: 'POST',
                    credentials:'include'
                    })
                } else {
                    console.log('refresh erreur')
                    return
                }
            }
            if (response.ok) {
                alert('like ajouté')
            }
            
        } catch(error) {
            console.error('erreur')
        } finally {
            setloading(false)
        }
    }

    const Dislike = async(commentId) => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`http://localhost:8000/api/films/commentaires/${commentId}/dislike`,{
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            await response.json()
            alert('dislike ajouté')
        } catch(error) {
            console.error('erreur')
        }
    }

    const Delete = async(commentId) => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`http://localhost:8000/api/films/commentaires/${commentId}`, {
                method: 'DELETE',
                headers : {Authorization: `Bearer ${token}`}
            })
            await response.json()
            if (response.ok) {
                Refresh()
            }
        } catch(error) {
            console.error('erreur')
        }
    }

    const Modify = async(commentId) => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`http://localhost:8000/api/films/commentaires/${commentId}`, {
                method: 'PUT',
                headers : {Authorization: `Bearer ${token}`},
                body: JSON.stringify({
                    texte: newtexte
                })
            })
            await response.json()
            if (response.ok) {
                Refresh()
                console.log('commentaire modifier')
            }
               
        } catch(error) {
            console.error('erreur')
        }
    }

    const handlelike = () => {
        if (IsAuth) {
            Like(item.id)
        } else {
            alert('vous devez etre connecté pour liker')
            return
        }
    }

    const handledislike = () => {
        if (IsAuth) {
            Dislike(item.id)
        } else {
            alert('vous devez etre connecté pour liker')
            return
        }
    }

    const handlemodify = (e) => {
        e.preventDefault()
        Modify(item.id)
        setnewtexte('')
    }
    const handlecache = () => {setcache(!cache)}

    if (loading) return <p>Chargement...</p>

    return(
        <Box sx={{ backgroundColor: "#2a2a2a", p: 2, borderRadius: 2, width: "100%" }}>
            <Typography variant="h6" sx={{ color: "#0c90b8ff" }}>
                {item.autor}
            </Typography>
            <Typography sx={{ mb: 1 }}>{item.texte}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {item.date}
            </Typography>
        
            <Box>
                <button onClick={()=>handlelike(item.id)}>Like</button>
                <button onClick={()=>handledislike(item.id)}>Dislike</button>
            </Box>
            
            {IsAuth  && item.username === userauth && (
                cache ? (
                <Box>
                    <form onSubmit={handlemodify}>
                        <input onChange={(e)=>setnewtexte(e.target.value)} value={newtexte} type="text"/>
                        <button type="submit">envoyer</button>
                    </form>
                    <Button onClick={()=>handlecache}>cacher</Button>
                    <Button onClick={()=>Delete(item.id)}>supprimer</Button>
                </Box>
            ) : (
                <Box>
                    <Button onClick={()=>handlecache}>Modifier</Button>
                </Box>
            ))}
                
        </Box>
    )
}