import { Typography, Box } from "@mui/material";
import { keyframes } from "@mui/material";

export default function Contact() {

    const gradientBG = keyframes`
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    `;

    return(
        <Box sx={{
            width: '100vw',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent:'center',
                color: '#fff',
                boxSizing: 'border-box',
                background: 'linear-gradient(-45deg, #000000, #4d4c4c, #050505, #0d0d0d)',
                backgroundSize: '400% 400%',
                animation: `${gradientBG} 15s ease infinite`,
            
                padding: { xs: '1rem', sm: '2rem' }, 

        }}>
            <Box sx={{
                backgroundColor:'#2a2828',
                padding: '2rem',
                borderRadius:'20px',
                border: '3px solid blue'
            }}>
                <Typography sx={{ fontWeight: '800' }}>
                    Tel : 06 ## ## ## ##
                </Typography>
                <Typography sx={{ fontWeight: '800' }}>
                    Email : Cine_allo@gmail.com
                </Typography>   
            </Box>
        </Box>
    )
}