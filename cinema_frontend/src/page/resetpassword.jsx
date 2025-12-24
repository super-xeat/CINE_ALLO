import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useAlert } from "../context/Alertcontext";

export default function Rest_password() {

    const [newpassword, setnewpassword] = useState('')
    const [confirmpassword, setconfirmpassword] = useState('')
    
    const [searchParams] = useSearchParams();  
    const token = searchParams.get('token');
    const {showSnackbar} = useAlert()
    const navigate = useNavigate()

    const Reset_mdp = async() => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/passwordreset/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    'password': newpassword,
                    'token':token
                }) 
            })
            if (response.ok) {
                
                setnewpassword('')
                setconfirmpassword('')
                navigate('/login')
                showSnackbar('mot de passe créer','success')
            } else {
                showSnackbar('erreur envoi', 'error')
            }
        } catch(error) {
            console.error('erreur', error)
        }
    }

    function verification(password, confirmpassword) {
        if (password.length < 8) {
            showSnackbar('Doit contenir au moins 8 caractère', 'info')
            return
        }
        if (password !== confirmpassword) {
            showSnackbar('le mot de passe ne correspond pas', 'info')
            return
        }
        Reset_mdp()
    }

    if (!token) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: "linear-gradient(135deg, #000000, #1a1a1a, #2b2b2b)",
          color: "white",
        }}
      >
        <Paper
          elevation={5}
          sx={{
            padding: 4,
            width: 400,
            borderRadius: 3,
            textAlign: "center",
            backgroundColor: "rgba(20,20,20,0.9)",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "#0c90b8ff" }}
          >
            Lien invalide
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Le lien de réinitialisation est invalide ou a expiré.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/oubli-mdp")}
            sx={{
              backgroundColor: "#0c90b8ff",
              "&:hover": { backgroundColor: "#0b7a9d" },
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Demander un nouveau lien
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: "linear-gradient(135deg, #000000, #1c1c1c, #2d2d2d)",
        color: "white",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          width: 400,
          borderRadius: 3,
          backgroundColor: "rgba(25,25,25,0.9)",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 2, color: "#0c90b8ff" }}
        >
          Nouveau mot de passe
        </Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            verification(newpassword, confirmpassword);
          }}
        >
          <TextField
            fullWidth
            type="password"
            label="Entrer un nouveau mot de passe"
            value={newpassword}
            onChange={(e) => setnewpassword(e.target.value)}
            margin="normal"
            variant="outlined"
            sx={{
              input: { color: "white" },
              label: { color: "gray" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#0c90b8ff" },
                "&:hover fieldset": { borderColor: "#0c90b8ff" },
                "&.Mui-focused fieldset": { borderColor: "#0c90b8ff" },
              },
            }}
          />

          <TextField
            fullWidth
            type="password"
            label="Confirmer le mot de passe"
            value={confirmpassword}
            onChange={(e) => setconfirmpassword(e.target.value)}
            margin="normal"
            variant="outlined"
            sx={{
              input: { color: "white" },
              label: { color: "gray" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#0c90b8ff" },
                "&:hover fieldset": { borderColor: "#0c90b8ff" },
                "&.Mui-focused fieldset": { borderColor: "#0c90b8ff" },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: "#0c90b8ff",
              "&:hover": { backgroundColor: "#0b7a9d" },
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Envoyer
          </Button>
        </form>
      </Paper>
    </Box>
  )}