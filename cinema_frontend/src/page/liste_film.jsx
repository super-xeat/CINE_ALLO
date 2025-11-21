import { useState, useEffect } from "react";
import CardFilm from "../components/film_card";
import Button from "../context/button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import './liste_film.css'


export default function Liste_films() {

  const [liste, setliste] = useState([]);
  const [bestnote, setbestnote] = useState([]);
  const [bestnoteTV, setbestnoteTV] = useState([]);
  const [popularTV, setpopularTV] = useState([]);
  const [affichage, setaffichage] = useState("populaire");

  useEffect(() => {
    const liste_film = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/films/liste_movie");
        const data = await response.json();
        setliste(data.liste_movie);
      } catch {
        console.log("error");
      }
    };
    liste_film();
  }, []);


  const Best_note = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/films/film_meilleur_note");
      if (!response.ok) console.log("erreur pas de reponse");
      const data = await response.json();
      setbestnote(data.top_rated);
    } catch (error) {
      console.error("erreur", error);
    }
  };

  const Best_note_serie = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/films/serie_meilleur_note");
      if (!response.ok) console.log("pas de reponse");
      const data = await response.json();
      setbestnoteTV(data.Serie_meilleur_note);
    } catch (error) {
      console.log("erreur", error);
    }
  };

  const Best_popular_serie = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/films/serie_populaire");
      if (!response.ok) console.log("pas de reponse");
      const data = await response.json();
      setpopularTV(data.Serie_meilleur);
    } catch (error) {
      console.log("erreur", error);
    }
  };

  const TVnote = (e) => (e.preventDefault(), Best_note_serie(), setaffichage("TV_note"));
  const TVpopulaire = (e) => (e.preventDefault(), Best_popular_serie(), setaffichage("TV_populaire"));

  const Populaire = (e) => {
    e.preventDefault();
    setaffichage("populaire");
  };

  const Bestnote = (e) => {
    e.preventDefault();
    Best_note();
    setaffichage("meilleur_note");
  };

  const getFilms = () => {
    switch (affichage) {
      case "meilleur_note":
        return bestnote;
      case "TV_note":
        return bestnoteTV;
      case "TV_populaire":
        return popularTV;
      default:
        return liste;
    }
  };

  return (
    <Box sx={{ p: 3 }} className="liste_film">
      <Box
        sx={{ 
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
        }}
       className="critere">
        <Button onClick={Populaire}>Film populaire</Button>
        <Button onClick={Bestnote}>Meilleur note</Button>
        <Button onClick={TVnote}>Meilleure série notée</Button>
        <Button onClick={TVpopulaire}>Série populaire</Button>
      </Box>

      <Typography
        variant="h5"
        align="center"
        sx={{ mb: 3, color: "white", textTransform: "capitalize" }}
      >
        {affichage.replace("_", " ")}
      </Typography>

      <Grid container spacing={3} justifyContent="center" columns={{ xs: 4, sm: 8, md: 12 }}>
        {getFilms().length > 0 ? (
          getFilms().map((film) => (
            <Grid 
              key={film.id} 
              item 
              xs={4}  
              sm={4}  
              md={3}  
            >
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CardFilm film={film}/>
              </Box>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ color: "gray" }}>
            Aucun résultat pour cette catégorie.
          </Typography>
        )}
      </Grid>
    </Box>
  );
}
