import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useAlert } from "../context/Alertcontext";


export default function Oubli_mdp() {

    const [email, setmail] = useState('')
    const {showSnackbar} = useAlert()

    const Envoyer_mail = async() => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/oubli-mdp/`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({'email': email})
            })
            if (response.ok) {
                showSnackbar('regardez vos mail', 'info')
            } else {
                showSnackbar('erreur envoi','error')
            }
        } catch(error) {
            console.error('erreur', error)
        }
    }

    function handlesubmit(e) {
        e.preventDefault()
        Envoyer_mail()
        setmail('')
    }

    return (
        <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: "linear-gradient(135deg, #000000, #1c1c1c, #2d2d2d)",
        backgroundSize: "400% 400%",
        animation: "gradientBG 12s ease infinite",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          width: 400,
          borderRadius: 3,
          textAlign: "center",
          backgroundColor: "rgba(30,30,30,0.9)",
          color: "white",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 2, color: "#0#0c90b8ff" }}
        >
          Réinitialisation du mot de passe
        </Typography>

        <Typography variant="body2" sx={{ mb: 3 }}>
          Veuillez entrer votre adresse e-mail pour recevoir le lien de
          réinitialisation.
        </Typography>

        <form onSubmit={handlesubmit}>
          <TextField
            fullWidth
            variant="outlined"
            label="Adresse e-mail"
            type="email"
            value={email}
            onChange={(e) => setmail(e.target.value)}
            sx={{
              input: { color: "white" },
              label: { color: "gray" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#0c90b8ff" },
                "&:hover fieldset": { borderColor: "#0c90b8ff" },
                "&.Mui-focused fieldset": { borderColor: "#0c90b8ff" },
              },
              mb: 3,
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 1,
              backgroundColor: "#0c90b8ff",
              "&:hover": { backgroundColor: "#0c90b8ff" },
              color: "#fff",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Envoyer le lien
          </Button>
        </form>
      </Paper>

    
      <style>
        {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </Box>
    )
}