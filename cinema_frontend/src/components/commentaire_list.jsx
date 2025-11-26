
import { useState, useEffect } from "react";
import {useParams} from 'react-router-dom'
import CommentItem from "./commentItem";
import CommentForm from "./commentForm";
import { useAuth } from "../context/authcontext";
import {
  Box,
  Typography,
  List,
  ListItem,
} from "@mui/material";

export default function CommentListe() {

    const {id} = useParams()
    const [loading, setloading] = useState(false)
    const [liste, setliste] = useState([])
    const {IsAuth} = useAuth()

    async function Liste() {
        setloading(true)
        try {
            const response = await fetch(`http://localhost:8000/api/films/commentaires?movie_id=${id}`)
            if (!response.ok) {
                console.log('erreur de fetch')
                alert('erreur de liste')
            }
            const data = await response.json()
            setliste(data)
            console.log('data :', data)

        } catch(error) {
            console.error('erreur', error)
        } finally {
            setloading(false)
        }
    } 

    useEffect(()=> {      
        Liste()
    }, [id])

    if (loading) return <p>chargement...</p>
    return(
        <Box sx={{ mt: 5 }}>
        <Typography variant="h4" sx={{ color: "#0c90b8ff", mb: 2, fontWeight: 'bold' }}>
            Commentaires :
        </Typography>

        <List sx={{ backgroundColor: "#1e1e1e", borderRadius: 3, p: 2 }}>
            {liste.length !== 0 ? (
            liste.map((comment) => (
                <ListItem key={comment.id}>
                    <CommentItem 
                    item={comment}
                    Refresh={Liste}
                    />
                </ListItem>
            ))
            ) : (
            <Typography>Aucun commentaire</Typography>
            )}
        </List>
        {IsAuth ? (
                <CommentForm id={id} Refresh={Liste}/> 
            ) : (
                <p>Vous devez vous connecter pour commenter</p>
            )
            }  
        </Box>
    )
} //enlever de comment form de detail film et le mettre là