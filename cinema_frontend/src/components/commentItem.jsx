
import { useState } from "react";
import { useAuth } from "../context/authcontext";
import useToken from "../hook/hook_token";
import { Box, Typography, Button, TextField, IconButton } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';


export default function CommentItem({item, Refresh}) {

    console.log('item :', item)

    const [loading, setloading] = useState(false)
    const [newtexte, setnewtexte] = useState('')
    const {IsAuth, userauth} = useAuth()
    const [cache, setcache] = useState(false)
    const {Refresh_token} = useToken()
    const [msg, setmsg] = useState([])

    const Like = async(commentId) => {   
        setloading(true)
        try {
            let response = await fetch(`http://localhost:8000/api/films/commentaires/${commentId}/like`,{
                method: 'POST',
                credentials:'include'
            })
            const data = await response.json()
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
                setmsg(data.message)
                Refresh()
            }
            
        } catch(error) {
            console.error('erreur')
        } finally {
            setloading(false)
        }
    }

    const Dislike = async(commentId) => {      
        try {
            const response = await fetch(`http://localhost:8000/api/films/commentaires/${commentId}/dislike`,{
                method: 'POST',
                credentials: 'include'
            })
            await response.json()

            if (response.status === 401) {
                const newtoken = await Refresh_token()

                if (newtoken) {
                    response = await fetch(`http://localhost:8000/api/films/commentaires/${commentId}/dislike`,{
                    method: 'POST',
                    credentials:'include'
                })
                } else {
                    console.log('erreur de refresh')
                    return
                }
            }
            if (response.ok) {
                alert('dislike ajouté')
                Refresh()
            }
        } catch(error) {
            console.error('erreur')
        }
    }

    const Delete = async(commentId) => {
    
        try {
            const response = await fetch(`http://localhost:8000/api/films/commentaires/${commentId}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            await response.json()

            if (response.status === 401) {
                const newtoken = await Refresh_token()
                if (newtoken) {
                    response = await fetch(`http://localhost:8000/api/films/commentaires/${commentId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                    })
                } else {
                    console.log('erreur de refresh')
                    return
                }}
            if (response.ok) {
                alert('commentaire supprimé')
                Refresh()
            }
        } catch(error) {
            console.error('erreur')
        }
    }

    const Modify = async(commentId) => {     
        try {
            const response = await fetch(`http://localhost:8000/api/films/commentaires/${commentId}`, {
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify({
                    texte: newtexte
                })
            })
            await response.json()

            if (response.status === 401) {
                const newtoken = await Refresh_token()

                if (newtoken) {
                    response = await fetch(`http://localhost:8000/api/films/commentaires/${commentId}`, {
                        method: 'PUT',
                        credentials: 'include',
                        body: JSON.stringify({
                            texte: newtexte
                        })
                    })
                } else {
                    console.log('erreur de refresh')
                    return
                }
            }
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
                {item.username}
            </Typography>
            <Typography sx={{ mb: 1, color:'#c6bdbdff' }}>{item.texte}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {item.date}
            </Typography>
        
            <Box>
                <IconButton 
                    onClick={handlelike} 
                    aria-label="like"
                    sx={{color : item.deja_like ? "#f5f1f1ff" : '#878383ff'}}
                    size="small">
                    <ThumbUpAltIcon />
                </IconButton>
                
                <IconButton 
                    onClick={handledislike} 
                    aria-label="dislike"
                    size="small"
                    sx={{color : item.deja_dislike ? "#f5f1f1ff" : '#878383ff'}}
                    >
                    
                    <ThumbDownAltIcon />
                </IconButton>
            </Box>
            
            {IsAuth  && item.username === userauth && (
                cache ? (
                <Box>
                    <form onSubmit={handlemodify}>
                        <TextField 
                            onChange={(e) => setnewtexte(e.target.value)} 
                            value={newtexte} 
                            type="text"
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mr: 1, backgroundColor: '#706d6dff', borderRadius: 1 }}
                        />
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