import { Link as RouterLink } from "react-router-dom";
import { Link} from "@mui/material";
import { useAuth } from "../context/authcontext"
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSearchParams } from "react-router-dom"
import { useAlert } from "../context/Alertcontext";


export default function LoginPage() {

    const navigate = useNavigate()
    const {Login} = useAuth()
    const [password, setpassword] = useState('')
    const [email, setemail] = useState('')
    const [searchparams] = useSearchParams()
    const statut = searchparams.get('statut')
    const {showSnackbar} = useAlert()

    useEffect(()=> {
        if (statut === 'success' ) {
        showSnackbar('compte créé avec succé !', 'success')
    }
    }, [statut])
    
    async function handlesubmit(e) {
    e.preventDefault()
    try {
        await Login(email, password)
        
        showSnackbar('Vous êtes connecté', 'success')
        setemail('')
        setpassword('')
        navigate(-1) 

    } catch(error) {
        console.error('Erreur :', error.message)
        showSnackbar(error.message, 'error')
    }
  }

    return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #444343ff, #2d2d2d, #000000)",
        backgroundSize: "400% 400%",
        animation: "gradientBG 12s ease infinite",
        "@keyframes gradientBG": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          width: 400,
          borderRadius: 3,
          backgroundColor: "rgba(20, 20, 20, 0.9)",
          color: "white",
          backdropFilter: "blur(8px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#12a6d3ff",
            textShadow: "0 0 10px rgba(29, 185, 84, 0.3)",
          }}
        >
          Connexion
        </Typography>

        <form onSubmit={handlesubmit}>
          <TextField
            fullWidth
            label="email d'utilisateur"
            value={email}
            type="email"
            onChange={(e) => setemail(e.target.value)}
            margin="normal"
            variant="outlined"
            InputLabelProps={{ style: { color: "#7d7b7bff" } }}
            InputProps={{
              style: { color: "white" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#1d80b9ff" },
                "&.Mui-focused fieldset": { borderColor: "#1d80b9ff" },
              },
            }}
          />

          <TextField
            fullWidth
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            margin="normal"
            variant="outlined"
            InputLabelProps={{ style: { color: "#837c7cff" } }}
            InputProps={{
              style: { color: "white" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#1d88b9ff" },
                "&.Mui-focused fieldset": { borderColor: "#1d5eb9ff" },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              fontWeight: "bold",
              backgroundColor: "#12a6d3ff",
              color: "#fff",
              "&:hover": { backgroundColor: "#0c90b8ff" },
              boxShadow: "0px 4px 10px rgba(29,185,84,0.3)",
            }}
          >
            Se connecter
          </Button>
        </form>
        <Typography variant="body2" align="right" sx={{ mt: 1 }}>
          <Link
            component={RouterLink}
            to="/oubli-mdp"
            underline="hover"
            sx={{
              color: "#0c90b8ff",
              fontWeight: 500,
              textDecoration: "none",
              transition: "0.3s",
              "&:hover": {
                color: "#0b7a9d",
                textDecoration: "underline",
              },
            }}
          >
            Mot de passe oublié ?
          </Link>
        </Typography>
      </Paper>
    </Box>
  )
}
    