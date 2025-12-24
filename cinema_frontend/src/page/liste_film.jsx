import { useState, useEffect } from "react";
import CardFilm from "../components/film_card";
import Button from "../context/button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './liste_film.css'


export default function Liste_films() {

  const [liste, setliste] = useState([]);
  const [bestnote, setbestnote] = useState([]);
  const [bestnoteTV, setbestnoteTV] = useState([]);
  const [popularTV, setpopularTV] = useState([]);
  const [affichage, setaffichage] = useState("populaire");

  const [page1, setpage1] = useState(1)
  const [totalpage1, settotalpage1] = useState('')

  const [page2, setpage2] = useState(1)
  const [totalpage2, settotalpage2] = useState('')

  const [page3, setpage3] = useState(1)
  const [totalpage3, settotalpage3] = useState('')

  const [page4, setpage4] = useState(1)
  const [totalpage4, settotalpage4] = useState('')


  useEffect(()=> {
    const liste_multiple_film = async() => {
      
        let url = ''
        let setter = null
        let settotalpage = null
        let page = 1

        switch(affichage) {
          case "populaire":
            url = `${process.env.REACT_APP_API_URL}/api/films/liste_movie?page=${page1}`
            setter = setliste
            settotalpage = settotalpage1
            page = page1
            break

          case 'meilleur_note':
            url = `${process.env.REACT_APP_API_URL}/api/films/film_meilleur_note?page=${page2}`
            setter = setbestnote
            settotalpage = settotalpage2
            page = page2
            break
          
          case 'tv_note':
            url = `${process.env.REACT_APP_API_URL}/api/films/serie_meilleur_note?page=${page3}`
            setter = setbestnoteTV
            settotalpage = settotalpage3
            page = page3
            break
          
          case 'tv_populaire':
            url = `${process.env.REACT_APP_API_URL}/api/films/serie_populaire?page=${page4}`
            setter = setpopularTV
            settotalpage = settotalpage4
            page = page4
            break
          }

        try {
          const response = await fetch(url, {
            credentials:'include'
          })
          if (!response.ok) throw new console.error();
          const data = await response.json()

          if (setter) setter(data.liste_movie || data.top_rated || data.Serie_meilleur_note || data.Serie_meilleur);
          if (settotalpage) {
            settotalpage(data.total_pages)
          }
        } catch(error) {
          console.error('erreur server'.error)
          if (setter) setter([])
        }
    }
    liste_multiple_film()
  }, [affichage, page1, page2, page3, page4])
  

  const TVnote = (e) => (e.preventDefault(), setaffichage("tv_note"));
  const TVpopulaire = (e) => (e.preventDefault(), setaffichage("tv_populaire"));

  const Populaire = (e) => {
    e.preventDefault();
    setaffichage("populaire");
  };

  const Bestnote = (e) => {
    e.preventDefault();
    setaffichage("meilleur_note");
  };

  const AfficheFilm = () => {
    switch(affichage) {
      case "meilleur_note":
        return {
          Films: bestnote,
          totalpage: totalpage2,
          page: page2,
          setpage: setpage2
        }
      case "tv_note":
        return {
          Films: bestnoteTV,
          totalpage: totalpage3,
          page: page3,
          setpage: setpage3
        }
      case "tv_populaire":
        return {
          Films: popularTV,
          totalpage: totalpage4,
          page: page4,
          setpage: setpage4
        }
      case "populaire":
      default:  
        return {
          Films: liste,
          totalpage: totalpage1,
          page: page1,
          setpage: setpage1
        }
    }
  }

  const handlePageChange = (e, newPage) => {
    const { setpage } = AfficheFilm();     
    if (setpage) {
        setpage(newPage); 
    }}

  const { Films, totalpage, page, setpage } = AfficheFilm();
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
        sx={{ mb: 3, color: "white", textTransform: "capitalize" , fontWeight:'800'}}
      >
        {affichage.replace("_", " ")}
      </Typography>

      <Grid container spacing={6} justifyContent="center" >
        {Films.length > 0 ? (
          Films.map((film) => (
            <Grid key={film.id} item 
              sx={{
              width: {  
                xs: '40%',   
                sm: '33.33%', 
                md: '25%',    
                lg: '16.66%', 
              }}}
            > 
          
              <CardFilm film={film}/>
              
            </Grid> 
          ))
        ) : (
          <Typography variant="body1" sx={{ color: "gray" }}>
            Aucun résultat pour cette catégorie.
          </Typography>
        )}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 , color: "#f6ededff"}}>
          <Pagination
              
              count={parseInt(totalpage) || 1} 
              page={page} 
              onChange={handlePageChange}         
              renderItem={(item) => (
                  <PaginationItem
                    sx={{color: "#f6ededff"}}
                      slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                      {...item}
                  />
              )}
          />
      </Box>
    </Box>
  );
}
