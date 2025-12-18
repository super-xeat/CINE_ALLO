import { Box, Typography } from "@mui/material"
import { keyframes } from "@mui/material"
import {Link} from "@mui/material";


export default function Propos() {

    const gradientBG = keyframes`
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
    `;
    return(
        <Box sx={{
        minHeight: '100vh', width: '100%',
        background: 'linear-gradient(-45deg, #000000, #4d4c4c, #050505, #0d0d0d)',
        backgroundSize: '400% 400%', 
        
        animation: `${gradientBG} 15s ease infinite`,
        color: 'white', 
        p: 3, 
    
      }}>
        <Box sx={{ml:'10%', mr:'10%'}}>
            <Typography variant="h6" >
                🎬 À Propos de Nous : 
            </Typography>
            <hr /><br /><br />
            <Typography variant="h10">
                Votre Guide Cinématographique Propulsé par TMDB
                Bienvenue sur notre plateforme, le lieu de rencontre des passionnés de 
                cinéma et des curieux en quête de leur prochain coup de cœur. 
                Nous sommes une équipe de développeurs et d'amateurs d'écrans 
                qui partageons la conviction que l'accès à l'information 
                cinématographique doit être simple, rapide et enrichissant. 
                Notre site est conçu non seulement pour vous offrir un catalogue de 
                films et de séries ultra-complet, mais aussi pour vous proposer 
                une expérience utilisateur personnalisée et intuitive. 
                Pour garantir cette richesse et cette précision de données, 
                nous nous appuyons sur The Movie Database (TMDB), 
                une base de données communautaire gigantesque et régulièrement mise à jour. 
                Grâce à l'API de TMDB, nous puisons en temps réel les informations essentielles : 
                des détails sur les castings et les équipes de production aux notes de la communauté, 
                en passant par les résumés et les affiches de haute qualité. Que vous cherchiez 
                les tendances du box-office, les classiques oubliés ou les films recommandés 
                par l'intelligence collective, notre mission est de vous connecter directement 
                à l'univers infini du cinéma.
            </Typography>
            <Link>
            contactez nous 
            </Link>
        </Box>
        </Box>
    )
}