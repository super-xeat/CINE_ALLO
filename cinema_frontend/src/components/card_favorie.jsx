import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation } from "react-router-dom";
import Hook_favori from "../hook/hook_favori";


export default function Card_favori({tmdb_id, statutActuel, liste, film}) {

    const [loading, setloading] = useState(false)
    const [statut, setstatut] = useState(statutActuel) 
    const {supprimer} = Hook_favori()
    const location = useLocation()

    const modify_statut = async(newstatu) => {
        setloading(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/modifier/${tmdb_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials:'include',
                body: JSON.stringify({'statut': newstatu})
            })
            if (!response.ok) {
                console.log('erreur de put', response.status)
                return
            }
            setstatut(newstatu)
            liste()
        } catch(error) {
            console.log('modification impossible', error)
        } finally {
            setloading(false)
        }
    }
    function handlesupprime(filmId) { 
      return async () => {
          await supprimer(filmId)
          if (location.pathname === '/profile') {
              liste(); 
          }
      }}

    if (!film) return <p>Film non trouvé</p>
    if (loading) return <p>Chargement...</p>

    
        return (
          <Box sx={{ 
            m: { xs: 0.5, sm: 1 }, 
            mx: 'auto',
            width: '100%', 
            maxWidth: { xs: 180, sm: 250 } 
        }}>
         <Card
          sx={{
          height: { xs: 'auto', sm: 500 },
          display: 'flex', 
          flexDirection: 'column',
          p: 2,
          borderRadius: 3,
          backgroundColor: "#1e1e1e",
          color: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          margin: "20px auto"
        }}
      >
    <Grid container spacing={2}>
      
      <Grid item xs={4}>
        <img
          src={
            film.poster_path
              ? `https://image.tmdb.org/t/p/w500${film.poster_path}`
              : film.image || "/placeholder.jpg"
          }
          alt={film.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "10px"
          }}
        />
      </Grid>

      <Grid item xs={8} display="flex" flexDirection="column" justifyContent="space-between">

        
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          {film.title || film.titre || "Titre non disponible"}
        </Typography>

        
        <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
          {(film.overview || film.synopsis || "Synopsis indisponible").slice(0, 100)}...
        </Typography>

        <Grid container spacing={1}>

          <Grid item xs={12}>
            <Select
              fullWidth
              size="small"
              value={statut}
              onChange={(e) => modify_statut(e.target.value)}
              sx={{
                bgcolor: "#121212",
                color: "#0c90b8ff",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#0c90b8ff" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#0c90b8ff" }
              }}
            >
              <MenuItem value="VOIR">À voir</MenuItem>
              <MenuItem value="VU">Vu</MenuItem>
              <MenuItem value="FAVORI">Favori</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={8}>
            <Button
              component={Link}
              to={`/detail_film/${film.type || "film"}/${tmdb_id}`}
              variant="contained"
              fullWidth
              sx={{
                bgcolor: "#141516ff",
                "&:hover": { bgcolor: "#666868ff" },
                textTransform: "none",
                borderRadius: 2,
                fontSize: "0.75rem",
                border: '1px solid #0c90b8ff'
              }}
            >
              <Typography sx={{fontWeight:'800', color:'#0c90b8ff'}}>Details</Typography>
            </Button>
          </Grid>

          <Grid item xs={4}>
            <Button
              variant="outlined"
              fullWidth
              color="error"
              onClick={handlesupprime(tmdb_id)} 
              sx={{
                borderRadius: 2,
                minWidth: 0,
                padding: "6px 0",
                color: '#0c90b8ff',
                marginLeft: '10px',
                borderColor: '#0c90b8ff',
                "&:hover": { bgcolor: "#666868ff" },
              }}
            >
              <DeleteIcon />
            </Button>
          </Grid>

        </Grid>

      </Grid>
    </Grid>
  </Card>
  </Box>
    ) 
}