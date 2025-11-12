import { useEffect, useState } from "react";
import { Card, IconButton, CardContent, Button, Typography, TextField, Stack, Avatar, Divider, Box } from "@mui/material";
import Hook_profil from "../hook/hook_profil";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import useToken from "../hook/hook_token";
import { Edit } from "@mui/icons-material";
import './profil.css'

export default function Profil() {

  const [liste, setListe] = useState([]);
  const [cache, setCache] = useState(false);

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [file, setFile] = useState(null);

  const [modiusername, setModiUsername] = useState(false);
  const [modifbio, setModifBio] = useState(false);
  const [modifimage, setModifImage] = useState(false);

  const { fetchProfil, result, loading} = Hook_profil()
  const {Refresh_token} = useToken()
  const {IsAuth} = useAuth()
  const navigate = useNavigate()


  useEffect(()=> {
    fetchProfil()
  }, [])

  async function fetchListeFavori() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('token recu')
      }
      let response = await fetch('http://localhost:8000/auth/voir_liste', {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      if (response.status === 401) {
        const newtoken = await Refresh_token()

        if (newtoken) {
            console.log('newtoken liste obtenu')
            response = await fetch('http://localhost:8000/auth/voir_liste', {
            headers: { 
              Authorization: `Bearer ${newtoken}`,
              'Content-Type': 'application/json'
             },
          })
          } else {
            console.log('Refresh failed - redirection login');
            setListe([]);
            return;
        }

        if (response.ok) {
            const data = await response.json();
            setListe(data || []);
        } else {       
            console.error('Erreur serveur:', response.status);
            setListe([]);
        }

    }} catch (error) {
      console.error(error);
      console.log('erreur de refresh')
    }
  }

  async function envoyer(champ, valeur) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append(champ, valeur);
    try {
      let response = await fetch('http://localhost:8000/auth/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (response.status === 401) {

        const newtoken = await Refresh_token()

        if (newtoken) {
          console.log('nouveau token succès')
          response = await fetch('http://localhost:8000/auth/profile', {
          method: 'PUT',
          headers: { Authorization: `Bearer ${newtoken}` },
          body: formData,
          })} else {
            console.log('Refresh failed - redirection login');
            return
          }
        }
      if (response.ok) fetchProfil()

    } catch (error) {
      console.error(error);
    }
  }

  const handleAvatarClick = () => {
    setModifImage(true);
  };

  

  console.log("image URL:", result.image)
  if (loading) return <Typography>Chargement...</Typography>;

  return (
  <Box display="flex" justifyContent="center" className="discover" sx={{ minHeight: '70vh'}} padding={3}>
    <Card sx={{ maxWidth: 600, width: '90%', p: 2, boxShadow: 4, backgroundColor:"rgba(137, 140, 137, 1)"}}>
      <CardContent>

        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Avatar
              alt={result.username}
              src={result.image ? result.image.startsWith('http') ? result.image : `http://localhost:8000/media/${result.image}` : undefined }
              sx={{ 
                width: 80, 
                height: 80, 
                cursor: modifimage ? 'default' : 'pointer',
                '&:hover': {
                  opacity: modifimage ? 1 : 0.8,
                }
              }}
              onClick={modifimage ? undefined : handleAvatarClick}
            > 
              {!result.image && result.username?.[0]}
            </Avatar>
            
            {!modifimage && (
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  width: 30,
                  height: 30,
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  }
                }}
                onClick={handleAvatarClick}
              >
                <Edit sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Box>

          <Stack>
            <Typography variant="h5" fontWeight="bold">
              Bienvenu {result.username}
            </Typography>
            {modiusername ? (
              <Stack direction="row" spacing={1} mt={1} >
                <TextField size="small" sx={{ backgroundColor:"#f1ececf0" }} value={username} onChange={(e) => setUsername(e.target.value)} label="Modifier nom" />
                <Button variant="contained" onClick={() => { envoyer('username', username); setUsername(''); }}>Envoyer</Button>
                <Button variant="outlined" color="secondary" sx={{ backgroundColor: '#ece6e6'}}
                onClick={() => setModiUsername(false)}>Annuler</Button>
              </Stack>
            ) : (
              <Button sx={{ backgroundColor:"#1380b3f0", color:"#f8f3f3" , boxShadow:"2", ":hover": {backgroundColor: '#0c648df0'}}} 
              variant="outlined" onClick={() => setModiUsername(true)}>Modifier le nom</Button>
            )}
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {modifimage && (
          <>
            <Typography variant="subtitle1" fontWeight="bold" mb={1} >
              Modifier la photo de profil
            </Typography>
            <Stack direction="row" spacing={1} mb={2} alignItems="center">
              <Button variant="outlined" component="label">
                Choisir un fichier
                <input 
                  type="file" 
                  hidden 
                  accept="image/*" 
                  onChange={(e) => setFile(e.target.files[0])} 
                />
              </Button>
              {file && (
                <Typography variant="body2">
                  Fichier sélectionné: {file.name}
                </Typography>
              )}
              <Button 
                variant="contained" 
                onClick={() => { envoyer('image', file); setFile(null); }}
                disabled={!file}
              >
                Envoyer
              </Button>
              <Button variant="outlined" sx={{ backgroundColor: '#ece6e6'}}
              color="secondary" onClick={() => { setModifImage(false); setFile(null); }}>
                Annuler
              </Button>
            </Stack>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        <Typography variant="subtitle1" fontWeight="bold">Ma bio:</Typography>
        <Typography variant="body1" mb={1}>{result.bio}</Typography>
        {modifbio ? (
          <Stack direction="row" spacing={1} mb={2}>
            <TextField size="small" sx={{ backgroundColor: '#ece6e6'}}
            value={bio} onChange={(e) => setBio(e.target.value)} label="Modifier bio" fullWidth />
            <Button variant="contained" onClick={() => { envoyer('bio', bio); setBio(''); }}>Envoyer</Button>
            <Button variant="outlined" sx={{ backgroundColor: '#ece6e6'}}
            color="secondary" onClick={() => setModifBio(false)}>Annuler</Button>
          </Stack>
        ) : (
          <Button variant="outlined" sx={{ backgroundColor:"#1380b3f0", color:"#f8f3f3" , boxShadow:"2", ":hover": {backgroundColor: '#0c648df0'}}}
           onClick={() => setModifBio(true)}>Modifier la bio</Button>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" fontWeight="bold" mb={1}>Mes favoris</Typography>
        {!cache ? (
          <Button variant="contained" onClick={() => { fetchListeFavori(); setCache(true); }}>Voir ma liste de favoris</Button>
        ) : (
          <>
            <Button variant="outlined" color="secondary" sx={{ backgroundColor: '#ece6e6'}} onClick={() => setCache(false)}>Cacher</Button>
            <Stack spacing={1} mt={2}>
              {liste.map((item) => (
                <Card key={item.id} variant="outlined" sx={{ p: 1 }}>
                  <Typography variant="subtitle1">{item.film}</Typography>
                  <Typography variant="body2">Statut: {item.statut}</Typography>
                  <Typography variant="body2">Ajouté le: {item.date_ajout}</Typography>
                </Card>
              ))}
            </Stack>
          </>
        )}

      </CardContent>
    </Card>
  </Box>
);
}
