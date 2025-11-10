
import { useAuth } from "../context/authcontext"
import Button from "../context/button"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSearchParams } from "react-router-dom"
import { TextField, Box, Paper, Typography } from "@mui/material";

export default function LoginPage() {

    const navigate = useNavigate()
    const {Login} = useAuth()
    const [password, setpassword] = useState('')
    const [username, setusername] = useState('')
    const [searchparams] = useSearchParams()
    const statut = searchparams.get('statut')

    useEffect(()=> {
        if (statut || statut === 'success' ) {
        alert('compte créé avec succée')
    }
    }, [statut])
    
    function handlesubmit(e) {
        e.preventDefault()
        Login(username, password)
        navigate(-1)
        setusername('')
        setpassword('')
    }

    return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Connexion
        </Typography>
        
        <form onSubmit={handlesubmit}>
          <TextField
            fullWidth
            label="Nom d'utilisateur"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            sx={{ mt: 3 }}
            size="large"
          >
            Se connecter
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
    