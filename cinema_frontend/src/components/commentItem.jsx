import { Box, Typography } from "@mui/material";


export default function CommentItem({item}) {

    return(
        <Box sx={{ backgroundColor: "#2a2a2a", p: 2, borderRadius: 2, width: "100%" }}>
            <Typography variant="h6" sx={{ color: "#0c90b8ff" }}>
                {item.autor}
            </Typography>
            <Typography sx={{ mb: 1 }}>{item.texte}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {item.date}
            </Typography>
        </Box>
    )
}