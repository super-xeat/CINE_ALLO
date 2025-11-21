
import { useState } from "react";
import { useParams } from 'react-router-dom'
import {
  Box,
  Card,
  Typography,
  TextField, 
  Button
} from "@mui/material";
import { useAuth } from "../context/authcontext";


export default function CommentForm() {

    const [texte, settexte] = useState('')
    const {id} = useParams()
    const {IsAuth} = useAuth()

    async function Comment() {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch('http://localhost:8000/api/films/commentaires', {
                method:'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    film_id: id,
                    texte: texte
                })
            })

            const data = await response.json()
            console.log('data :', data)

        } catch(error) {
            console.error('erreur', error)
        }
    }

    const handlesubmit = (e) => (e.preventDefault(), Comment(), settexte(''))

    return(
        <Box sx={{ mt: 4 }}>
        {IsAuth ? (
            <Card sx={{ backgroundColor: "#1e1e1e", p: 2, borderRadius: 3 }}>
            <form onSubmit={handlesubmit}>
                <TextField
                fullWidth
                placeholder="Écrivez votre commentaire..."
                value={texte}
                onChange={(e) => settexte(e.target.value)}
                variant="outlined"
                sx={{
                    input: { color: "white" },
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#0c90b8ff" },
                    "&:hover fieldset": { borderColor: "#0c90b8ff" }
                    }
                }}
                />

                <Button
                type="submit"
                variant="contained"
                sx={{
                    backgroundColor: "#0c90b8ff",
                    "&:hover": { backgroundColor: "#0a7a9b" }
                }}
                >
                Envoyer
                </Button>
            </form>
            </Card>
        ) : (
            <Typography>Vous devez vous connecter pour commenter</Typography>
        )}
        </Box>

    )
}