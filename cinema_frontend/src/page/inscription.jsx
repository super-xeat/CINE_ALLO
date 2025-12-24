import { useAlert } from "../context/Alertcontext";
import { useState, useEffect } from "react"
import { Card, CardContent, TextField, Button, Stack, Typography, Box } from "@mui/material";


export default function Register() {

    const [username, setusername] = useState('')
    const [bio, setbio] = useState('')
    const [identifiant, setidentifiant] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [file, setfile] = useState(null)
    const [confirmpassword, setconfirmpassword] = useState('')
    const {showSnackbar} = useAlert()

    function handlesubmit(e) {
        e.preventDefault()
        Inscription()
        setusername('')
        setbio('')
        setidentifiant('')
        setemail('')
        setfile(null)
    }

    
    async function Inscription() {
        const formdata = new FormData()
        formdata.append('confirm_password', confirmpassword)
    
        formdata.append('image', file)
        formdata.append('username', username)
        formdata.append('bio', bio)
        formdata.append('identifiant', identifiant)
        formdata.append('email', email)
        formdata.append('password', password)

        try {
            const response = await fetch('http://localhost:8000/auth/register/', {
                method: 'POST',
                body: formdata
            })

            const data = await response.json()
            console.log('data envoyé', data)
            
        } catch(error) {
            console.error('erreur de formdata', error)
        }
    }
    
    
    return(
        <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #464545ff, #616060ff)",
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: "90%",
          p: 3,
          boxShadow: 6,
          borderRadius: 3,
          backgroundColor: "#2c2b2bff",
          color: "#fff",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="h1"
            textAlign="center"
            mb={3}
            sx={{ fontWeight: "bold", color: "#1d92b9ff" }}
          >
            Crée ton compte 
          </Typography>

          <form onSubmit={handlesubmit}>
            <Stack spacing={2}>
              <TextField
                label="Nom d'utilisateur"
                variant="outlined"
                size="small"
                fullWidth
                value={username}
                onChange={(e) => setusername(e.target.value)}
                InputLabelProps={{ style: { color: "#ccc" } }}
                InputProps={{ style: { color: "white" } }}
              />

              <TextField
                label="Bio"
                variant="outlined"
                size="small"
                fullWidth
                value={bio}
                onChange={(e) => setbio(e.target.value)}
                multiline
                minRows={2}
                InputLabelProps={{ style: { color: "#ccc" } }}
                InputProps={{ style: { color: "white" } }}
              />

              <TextField
                label="Identifiant"
                variant="outlined"
                size="small"
                fullWidth
                value={identifiant}
                onChange={(e) => setidentifiant(e.target.value)}
                InputLabelProps={{ style: { color: "#ccc" } }}
                InputProps={{ style: { color: "white" } }}
              />

              <TextField
                label="Email"
                type="email"
                variant="outlined"
                size="small"
                fullWidth
                value={email}
                onChange={(e) => setemail(e.target.value)}
                InputLabelProps={{ style: { color: "#ccc" } }}
                InputProps={{ style: { color: "white" } }}
              />

              <TextField
                label="Mot de passe"
                type="password"
                variant="outlined"
                size="small"
                fullWidth
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                InputLabelProps={{ style: { color: "#ccc" } }}
                InputProps={{ style: { color: "white" } }}
              />

              <TextField
                label="Confirmer le mot de passe"
                type="password"
                variant="outlined"
                size="small"
                fullWidth
                value={confirmpassword}
                onChange={(e) => setconfirmpassword(e.target.value)}
                InputLabelProps={{ style: { color: "#ccc" } }}
                InputProps={{ style: { color: "white" } }}
              />

              <Button
                variant="contained"
                component="label"
                sx={{
                  backgroundColor: "#1d80b9ff",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#176795ff" },
                }}
              >
                Importer une image
                <input
                  type="file"
                  hidden
                  onChange={(e) => setfile(e.target.files[0])}
                />
              </Button>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#1d80b9ff",
                  color: "#fff",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#176795ff" },
                }}
                
              >
                Envoyer
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}