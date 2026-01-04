
import { useState } from "react";
import { useAuth } from "../context/authcontext";
import useToken from "../hook/hook_token";
import { Box, Typography, Button, TextField, IconButton, Tooltip, Stack } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { useAlert } from "../context/Alertcontext";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function CommentItem({item, Refresh}) {

    const [loading, setloading] = useState(false)
    const [newtexte, setnewtexte] = useState('')
    const {IsAuth, userauth} = useAuth()
    const [cache, setcache] = useState(false)
    const {Refresh_token} = useToken()
    const [msg, setmsg] = useState([])
    const {showSnackbar} = useAlert()

    const Like = async(commentId) => {   
        setloading(true)
        try {
            let response = await fetch(`${import.meta.env.VITE_API_URL}/api/films/commentaires/${commentId}/like/`,{
                method: 'POST',
                credentials:'include'
            })
            const data = await response.json()
            if (response.status === 401) {
                const newtoken = await Refresh_token()

                if (newtoken) {
                    response = await fetch(`${import.meta.env.VITE_API_URL}/api/films/commentaires/${commentId}/like/`,{
                    method: 'POST',
                    credentials:'include'
                    })
                } else {
                    showSnackbar('erreur de refresh', 'error')
                    return
                }
            }
            if (response.ok) {
                showSnackbar('like ajouté !', 'success')
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
            let response = await fetch(`${import.meta.env.VITE_API_URL}/api/films/commentaires/${commentId}/dislike/`,{
                method: 'POST',
                credentials: 'include'
            })
            await response.json()

            if (response.status === 401) {
                const newtoken = await Refresh_token()

                if (newtoken) {
                    response = await fetch(`${import.meta.env.VITE_API_URL}/api/films/commentaires/${commentId}/dislike/`,{
                    method: 'POST',
                    credentials:'include'
                })
                } else {
                    console.log('erreur de refresh')
                    return
                }
            }
            if (response.ok) {
                showSnackbar('dislike ajouté', 'success')
                Refresh()
            }
        } catch(error) {
            console.error('erreur')
        }
    }

    const Delete = async(commentId) => {
    
        try {
            let response = await fetch(`${import.meta.env.VITE_API_URL}/api/films/commentaires/${commentId}/`, {
                method: 'DELETE',
                credentials: 'include'
            })

            await response.json()

            if (response.status === 401) {
                const newtoken = await Refresh_token()
                if (newtoken) {
                    response = await fetch(`${import.meta.env.VITE_API_URL}/api/films/commentaires/${commentId}/`, {
                    method: 'DELETE',
                    credentials: 'include'
                    })
                } else {
                    console.log('erreur de refresh')
                    return
                }}
            if (response.ok) {
                showSnackbar('commentaire supprimer !', 'success')
                Refresh()
            }
        } catch(error) {
            console.error('erreur')
        }
    }

    const Modify = async(commentId) => {     
        try {
            let response = await fetch(`${import.meta.env.VITE_API_URL}/api/films/commentaires/${commentId}/`, {
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
                    response = await fetch(`${import.meta.env.VITE_API_URL}/api/films/commentaires/${commentId}/`, {
                        method: 'PUT',
                        credentials: 'include',
                        body: JSON.stringify({
                            texte: newtexte
                        })
                    })
                } else {
                    showSnackbar('erreur de refresh','error')
                    return
                }
            }
            if (response.ok) {
                Refresh()
                showSnackbar('commentaire modifié','info')
            }              
        } catch(error) {
            console.error('erreur')
        }
    }

    const handlelike = () => {
        if (IsAuth) {
            Like(item.id)

        } else {
            showSnackbar('vous devez etre connecté pour liké', 'info')
            return
        }
    }

    const handledislike = () => {
        if (IsAuth) {
            Dislike(item.id)
        
        } else {
            showSnackbar('vous devez etre connecté pour dislike', 'info')
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
            
        {IsAuth && item.username === userauth && (
                <Box sx={{ mt: 1 }}>
                    {cache ? (
                        
                        <Box component="form" onSubmit={handlemodify} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField 
                                onChange={(e) => setnewtexte(e.target.value)} 
                                value={newtexte} 
                                size="small"
                                fullWidth
                                autoFocus
                                sx={{ 
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                                    borderRadius: 1,
                                    input: { color: 'white' }
                                }}
                            />
                            <Stack direction="row" spacing={0.5}>
                                <Tooltip title="Enregistrer">
                                    <IconButton type="submit" color="success" size="small">
                                        <CheckIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Annuler">
                                    <IconButton onClick={handlecache} color="error" size="small">
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Supprimer définitivement">
                                    <IconButton onClick={() => Delete(item.id)} color="error" size="small">
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Box>
                    ) : (
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button 
                                startIcon={<EditIcon />} 
                                size="small" 
                                onClick={handlecache}
                                sx={{ 
                                    color: 'rgba(255,255,255,0.6)', 
                                    '&:hover': { color: '#12a6d3ff' } 
                                }}
                            >
                                Modifier
                            </Button>
                        </Box>
                    )}
                </Box>
            )}
                
        </Box>
    )
}