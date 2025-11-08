import { useEffect, useState } from "react";
import { Card, CardContent, Button, Typography, TextField, Stack, Avatar, Divider, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/authcontext'
import useToken from "../hook/hook_token";

export default function Profil() {

  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(true);
  const [liste, setListe] = useState([]);
  const [cache, setCache] = useState(false);

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [file, setFile] = useState(null);

  const [modiusername, setModiUsername] = useState(false);
  const [modifbio, setModifBio] = useState(false);
  const [modifimage, setModifImage] = useState(false);

  const {setIsAuth} = useAuth()
  const navigate = useNavigate()
  const {Refresh_token} = useToken()

  const fetchProfil = async() => {
    try {
      let token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        setIsAuth(false)
        return
      }

      let response = await fetch('http://localhost:8000/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 401) {
        const newToken = await Refresh_token()
        if (newToken) {
          response = await fetch('http://localhost:8000/auth/profile', {
            headers: { Authorization: `Bearer ${newToken}` },
          });
        } else {
          localStorage.removeItem('token');
          navigate('/login');
          setIsAuth(false);
          return;
        }
      }

      const data = await response.json();
      setResult(data)

    } catch (error) {
      console.error('erreur fetch profil', error);
    } finally {
      setLoading(false);
    }
  }

  
  useEffect(() => {
    const verifierToken = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login')
        setIsAuth(false)
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/auth/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (response.status === 401) {
          const newToken = await Refresh_token()
          if (!newToken) {
            localStorage.removeItem('token');
            navigate('/login');
            setIsAuth(false)
          }
        }

      } catch (error) {
        console.error('pas de token', error)
      } 
    } 

    const interval = setInterval(verifierToken, 500000);
    return () => clearInterval(interval);
  }, [])

  useEffect(()=> {
    fetchProfil()
  }, [])

  async function fetchListeFavori() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/auth/voir_liste', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setListe(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function envoyer(champ, valeur) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append(champ, valeur);
    try {
      const response = await fetch('http://localhost:8000/auth/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (response.ok) fetchProfil();
    } catch (error) {
      console.error(error);
    }
  }

  console.log("image URL:", result.image)
  if (loading) return <Typography>Chargement...</Typography>;

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Card sx={{ maxWidth: 600, width: '90%', p: 2, boxShadow: 4 }}>
        <CardContent>

          
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>

            <Avatar
              alt={result.username}
              src={result.image ? result.image.startsWith('http') ? result.image : `http://localhost:8000${result.image}` : undefined}
              sx={{ width: 80, height: 80 }}
            >
              {!result.image && result.username?.[0]}
            </Avatar>
            <Stack>
              <Typography variant="h5" fontWeight="bold">
                Bienvenu {result.username}
              </Typography>
              {modiusername ? (
                <Stack direction="row" spacing={1} mt={1}>
                  <TextField size="small" value={username} onChange={(e) => setUsername(e.target.value)} label="Modifier nom" />
                  <Button variant="contained" onClick={() => { envoyer('username', username); setUsername(''); }}>Envoyer</Button>
                  <Button variant="outlined" color="secondary" onClick={() => setModiUsername(false)}>Annuler</Button>
                </Stack>
              ) : (
                <Button variant="outlined" onClick={() => setModiUsername(true)}>Modifier le nom</Button>
              )}
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />

          
          <Typography variant="subtitle1" fontWeight="bold">Ma bio:</Typography>
          <Typography variant="body1" mb={1}>{result.bio}</Typography>
          {modifbio ? (
            <Stack direction="row" spacing={1} mb={2}>
              <TextField size="small" value={bio} onChange={(e) => setBio(e.target.value)} label="Modifier bio" fullWidth />
              <Button variant="contained" onClick={() => { envoyer('bio', bio); setBio(''); }}>Envoyer</Button>
              <Button variant="outlined" color="secondary" onClick={() => setModifBio(false)}>Annuler</Button>
            </Stack>
          ) : (
            <Button variant="outlined" onClick={() => setModifBio(true)}>Modifier la bio</Button>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight="bold" mb={1}>Photo de profil:</Typography>
          {modifimage ? (
            <Stack direction="row" spacing={1} mb={2} alignItems="center">
              <Button variant="outlined" component="label">
                Choisir un fichier
                <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
              </Button>
              <Button variant="contained" onClick={() => { envoyer('image', file); setFile(null); }}>Envoyer</Button>
              <Button variant="outlined" color="secondary" onClick={() => setModifImage(false)}>Annuler</Button>
            </Stack>
          ) : (
            <Button variant="outlined" onClick={() => setModifImage(true)}>Modifier l'image</Button>
          )}

          <Divider sx={{ my: 2 }} />

          
          <Typography variant="h6" fontWeight="bold" mb={1}>Mes favoris</Typography>
          {!cache ? (
            <Button variant="contained" onClick={() => { fetchListeFavori(); setCache(true); }}>Voir ma liste de favoris</Button>
          ) : (
            <>
              <Button variant="outlined" color="secondary" onClick={() => setCache(false)}>Cacher</Button>
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
