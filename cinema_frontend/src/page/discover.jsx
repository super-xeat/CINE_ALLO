import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Card_film from "../components/film_card";
import Grid from "@mui/material/Grid";

import Typography from "@mui/material/Typography";


export default function Discover() {

  const [result, setresult] = useState([]);
  const [searchparams, setsearchparams] = useSearchParams();
  const [loading, setloading] = useState(false);

  const genres = searchparams.get('with_genres') || ''
  const year = searchparams.get('realised_date') || ''
  const country = searchparams.get('with_origin_country') || ''

  const Decouverte = async () => {
    setloading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/films/discover?${searchparams.toString()}`);
      if (!response.ok) console.log('erreur dans la reponse');
      const data = await response.json();
      setresult(data.liste_discover_filtre)

    } catch (error) {
      console.error('erreur de fetch', error);
    } finally {
      setloading(false);
    }
  };

  const handlegenre = (e) => {
    const newgenre = e.target.value;
    const new_params = new URLSearchParams(searchparams);
    if (newgenre) new_params.set('with_genres', newgenre);
    else new_params.delete('with_genres');
    setsearchparams(new_params);
  };

  const handledate = (e) => {
    const newdate = e.target.value;
    const new_params = new URLSearchParams(searchparams);
    if (newdate) new_params.set('year', newdate);
    else new_params.delete('year');
    setsearchparams(new_params);
  };

const handlenote = (e) => {
    const choix = e.target.value;
    const newparams = new URLSearchParams(searchparams);
    
    newparams.delete('vote_average.gte');
    newparams.delete('vote_average.lte');
    newparams.delete('sort_by')
 
    if (choix === 'excellent') {
        newparams.set('vote_average.gte', '8');
        newparams.set('sort_by', 'vote_average.desc');
          
      } else if (choix === 'bon') {   
        newparams.set('vote_average.gte', '7');
        newparams.set('sort_by', 'vote_average.desc');
          
      } else if (choix === 'nul_culte') {
        newparams.set('vote_average.lte', '4');
        newparams.set('sort_by', 'vote_average.asc');
          
      } else if (choix === 'tres_mauvais') {
        newparams.set('vote_average.lte', '2');
        newparams.set('sort_by', 'vote_average.asc');
      }
      setsearchparams(newparams)
    }

  const NoteFilter = () => {
    if (searchparams.get('vote_average.gte') === '8') return 'excellent';
    if (searchparams.get('vote_average.gte') === '7') return 'bon';
    if (searchparams.get('vote_average.lte') === '4') return 'nul_culte';
    if (searchparams.get('vote_average.lte') === '2') return 'tres_mauvais';
    return ''
  }

  const handlepays = (e) => {
    const newpays = e.target.value
    const params = new URLSearchParams(searchparams)
    if (newpays) params.set('with_origin_country', newpays)
    else params.delete('with_origin_country')
    setsearchparams(params)
  }

  useEffect(() => {
    if (searchparams) Decouverte();
  }, [searchparams]);

  return (
    <div>
      <h1>Découvrir des films</h1>
      
      <div className="filters">
        <h2>Genre</h2>
        <select onChange={handlegenre} value={genres}>
          <option value="">Tous les genres</option>
          <option value="28">Action</option>
          <option value="12">Aventure</option>
          <option value="18">Drame</option>
          <option value="35">Comédie</option>
          <option value="27">Horreur</option>
          <option value="10749">Romance</option>
          <option value="80">Policier</option>
        </select>

        <h2>Année de sortie</h2>
        <select onChange={handledate} value={year}>
          <option value="">Toutes les années</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
        </select>

        <h2>les mieux notés</h2>
        <select onChange={handlenote} value={NoteFilter()}>
            <option value="">Toutes notes</option>
            <option value="excellent">Excellent</option>
            <option value="bon">Bon</option>
            <option value="nul_culte">Nul mais culte</option>
            <option value="tres_mauvais">Très mauvais</option>
        </select>

        <h2>par pays</h2>
        <select onChange={handlepays} value={country}>
          <option value="">Tous les pays</option>
          <option value="FR">France</option>
          <option value="US">États-Unis</option>
          <option value="JP">Japon</option>
          <option value="KR">Corée du Sud</option>
          <option value="GB">Royaume-Uni</option>
        </select>
      </div>
 
      {loading && <p>Chargement...</p>}

      <Grid container spacing={3} justifyContent="center" columns={{ xs: 4, sm: 8, md: 12 }}>
        {result.length > 0 ? (
          result.map((movie) => (
            <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
              <Card_film film={movie} />
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ color: "gray", mt: 2 }}>
            Aucun résultat pour cette recherche.
          </Typography>
        )}
      </Grid>
    </div>
  );
}
