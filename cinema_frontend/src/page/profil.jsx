import { useEffect, useState } from "react";
import { Card, IconButton, CardContent, Button, Typography, TextField, Stack, Avatar, Divider, Box } from "@mui/material";
import Hook_profil from "../hook/hook_profil";
import useToken from "../hook/hook_token";
import { Edit, Key } from "@mui/icons-material";
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Card_favori from "../components/card_favorie";
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

  const [loader, setloader] = useState(false)
  const [page, setpage] = useState(1)
  const [pageSuivante, setpageSuivante] = useState(true)

  const { fetchProfil, result, loading} = Hook_profil()
  const {Refresh_token} = useToken()


  useEffect(()=> {
    fetchProfil()
  }, [])

  const Recup_film = async(recup_liste) => {
    try {
      const films = await Promise.all(
        recup_liste.map(async(item)=> {
          try {
            const response = await fetch(`http://localhost:8000/auth/recup_film/${item.tmdb_id}`)
            if (response.ok) {
              const data = await response.json()
              console.log('data recup :', data)
              return {...item, tmdb_champ: data}
            } else {
              console.log('erreur recup item', response.status)
              return item
            }
          } catch(error) {
            console.log('erreur recup item', error)
            return item
          }
        })
      )
      return films
      
    } catch(error) {
      console.error('erreur de la demande recup_film')
      return recup_liste
    }
  } 

  async function fetchListeFavori(pagenum = 1) {
    try {
      setloader(true)
      let response = await fetch(`http://localhost:8000/auth/voir_liste?page=${pagenum}`, {
        credentials:'include'
      })
      
      if (response.status === 401) {
        const newtoken = await Refresh_token()

        if (newtoken) {
            console.log('newtoken liste obtenu')
            response = await fetch(`http://localhost:8000/auth/voir_liste?page=${pagenum}`, {
            credentials:'include'
          })
          } else {
            console.log('Refresh failed - redirection login');
            setListe([])
            return
        }}

      if (response.ok) {
          const data = await response.json();
          console.log('data :', data)

          let recup_liste
          if (pagenum === 1) {
            recup_liste = data.results
            const newliste = await Recup_film(recup_liste)
            setListe(newliste)
          } else {
            recup_liste = data.results
            const newliste = await Recup_film(recup_liste)
            setListe(liste => [...liste, ...newliste])
            
          }
                 
          setpage(pagenum)
          console.log('data :', data)
        } else {       
            console.error('Erreur serveur:', response.status);
        }

    } catch (error) {
      console.error(error);
      console.log('erreur de refresh')
    } finally {
      setloader(false)
    }
  }

  async function envoyer(champ, valeur) {
    const formData = new FormData();
    formData.append(champ, valeur);
    try {
      let response = await fetch('http://localhost:8000/auth/profile', {
        method: 'PATCH',
        credentials:'include',
        body: formData,
      })

      if (response.status === 401) {

        const newtoken = await Refresh_token()

        if (newtoken) {
            console.log('nouveau token succès')
            response = await fetch('http://localhost:8000/auth/profile', {
            method: 'PATCH',
            credentials:'include',
            body: formData,
          })} else {
            console.log('Refresh failed - redirection login');
            return
          }}
      if (response.ok) fetchProfil()
    } catch (error) {
      console.error(error);
    }}

  const handleAvatarClick = () => {
    setModifImage(true);
  };

  console.log("image URL:", result.image)
  if (loading) return <Typography>Chargement...</Typography>;
  
  const chargerplus = () => {
    if (!loader) {
      fetchListeFavori(page + 1)
    }
  }
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
              <Button size="small" variant="contained" sx={{ backgroundColor:"#1380b3f0", color:"#f8f3f3" , boxShadow:"2", ":hover": {backgroundColor: '#0c648df0'}}} 
               onClick={() => setModiUsername(true)}>Modifier le nom</Button>
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

        <Typography size="small" variant="subtitle1" fontWeight="bold">Ma bio:</Typography>
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
          <Button variant="contained" onClick={() => { fetchListeFavori(1); setCache(true); }}>Voir ma liste de favoris</Button>
        ) : (
          <>
            <Button variant="outlined" color="secondary" sx={{ backgroundColor: '#ece6e6'}} onClick={() => setCache(false)}>Cacher</Button>
            <Stack spacing={1} mt={2}>
            {liste.map((item) => { 
              console.log("Item avec infos TMDB:", item)
              return(
                <div key={item.id}>
                  <Card_favori 
                    tmdb_id={item.tmdb_id}
                    statutActuel={item.statut}
                    liste={()=>fetchListeFavori(1)}
                    film={item.tmdb_champ || item}
                  />
                </div>
              )
            })}
            <Box display="flex" justifyContent="center" mt={2}>
              <Button 
                variant="outlined" 
                onClick={chargerplus}
                disabled={loader}
                sx={{backgroundColor:'#282727ff', "&:hover": { bgcolor: "#474747ff" }}}
              >
                {loader ? 'Chargement...' : <AddCircleIcon />}
              </Button>
            </Box>
          </Stack>
          </>
        )}
          
          

      </CardContent>
    </Card>
  </Box>
);
}
