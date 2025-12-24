
import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  TextField, 
  Button
} from "@mui/material";
import { useAuth } from "../context/authcontext";
import useToken from "../hook/hook_token";

export default function CommentForm({id, Refresh}) {

    const [texte, settexte] = useState('')
    const {IsAuth} = useAuth()
    const {Refresh_token} = useToken()

    async function Comment() {
        try {
            let response = await fetch(`${process.env.REACT_APP_API_URL}/api/films/commentaires?movie_id=${id}`, {
                method:'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                credentials:'include',
                body: JSON.stringify({
                    texte: texte
                })
            })
            if (response.status === 401) {
                const newtoken = await Refresh_token()
                if (newtoken) {
                    response = await fetch(`${process.env.REACT_APP_API_URL}/api/films/commentaires?movie_id=${id}`, {
                    method:'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    credentials:'include',
                    body: JSON.stringify({
                        texte: texte
                    })})
                }
            }
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erreur serveur:', errorData);
                throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
            }
            if (response.ok) {
                Refresh()
                settexte('')
            }
            const data = await response.json()

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