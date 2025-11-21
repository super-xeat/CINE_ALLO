import Button from "../context/button";
import Recherche_barre from "../hook/hook_recherche";
import './recherche.css';
import { useState } from "react";
import CardFilmAccueil from "../components/film_card_accueil";
import { motion } from "framer-motion";
import { Grid, Typography } from "@mui/material";

export default function Recherche() {

  const { fetch_recherche, query, setquery, result, loading } = Recherche_barre();
  const [change1, setchange1] = useState(false);
  const [change2, setchange2] = useState(false);
  const [liste, setliste] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  function handlesubmit(e) {
    e.preventDefault();
    fetch_recherche(query);
    setchange1(true);
    setchange2(false);
    setHasSearched(true);
  }

  async function handleproposition(params) {
      try {
          const response = await fetch(`http://localhost:8000/api/films/discover?${params}`);
          const data = await response.json();
          setliste(data.liste_discover_filtre || []);
          setchange1(false);
          setchange2(true);
          setHasSearched(true);
      } catch (error) {
        console.error('Erreur de fetch', error)
        setliste([])
      }
    }

  return ( 
    <div className={`recherche ${hasSearched ? "recherche-active" : ""}`}>
      <div className={`search-container ${hasSearched ? "search-top" : "search-center"}`}>
        <form onSubmit={handlesubmit} className="formulaire">
          <div className="input-wrapper">
            <input
              value={query}
              type="text"
              onChange={(e) => setquery(e.target.value)}
              placeholder="Rechercher un film..."
              className="search-input"
            />
          </div>
        </form>

        <div className="suggestions">
          <Button onClick={() => handleproposition("with_genres=35&year=1980&with_origin_country=US")}>
            Meilleur comédies des années 80
          </Button>
          <Button onClick={() => handleproposition("with_genres=27&year_gte=2000&with_origin_country=US")}>
            Meilleur films horreur des 20 dernières années
          </Button>
          <Button onClick={() => handleproposition("with_genres=28&year=2000&with_origin_country=US")}>
            Meilleur action années 2000
          </Button>
          <Button onClick={() => handleproposition("with_genres=10749&with_origin_country=US")}>
            Comédies romantiques
          </Button>
          <Button onClick={() => handleproposition("with_genres=10752&with_origin_country=US")}>
            Films de guerre
          </Button>
          <Button onClick={() => handleproposition("with_genres=10402&year=1980&with_origin_country=US")}>
            Comédies musicales 80s
          </Button>
        </div>
      </div>

      {loading && <Typography variant="body1">Chargement...</Typography>}

      <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }} className="resultats-liste">
        
        {change1 && result?.result_film?.film_similaire?.map((film, index) => (
          <Grid key={film.id} item xs={12} sm={10} md={8}>
            <Typography>Films Similaire</Typography>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <CardFilmAccueil film={film} horizontal />
            </motion.div>
          </Grid>
        ))}

        {change1 && result?.result_film?.film_recommande?.map((film, index) => (
          <Grid key={film.id} item xs={12} sm={10} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <CardFilmAccueil film={film} horizontal />
            </motion.div>
          </Grid>
        ))}

        {change1 && result?.result_serie?.serie_recommandation?.map((film, index) => (
          <Grid key={film.id} item xs={12} sm={10} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <CardFilmAccueil film={film} horizontal />
            </motion.div>
          </Grid>
        ))}

        {change1 && result?.result_serie?.serie_similaire?.map((film, index) => (
          <Grid key={film.id} item xs={12} sm={10} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <CardFilmAccueil film={film} horizontal />
            </motion.div>
          </Grid>
        ))}

        {change2 && liste?.map((film, index) => (
          
          <Grid key={film.id} xs={12} sm={10} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <CardFilmAccueil film={film} horizontal />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}