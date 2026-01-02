import { useState } from "react";
import useToken from "./hook_token";
import { useAlert } from "../context/Alertcontext";

export default function Hook_favori() {
    
    const [loading, setloading] = useState(false)
    const {Refresh_token} = useToken()
    const {showSnackbar} = useAlert()

    async function Favori(id) {
        setloading(true)
        try {

            let response = await fetch(`${import.meta.env.VITE_API_URL}/auth/ajout_film/`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                credentials:'include',
                body: JSON.stringify({
                    tmdb_id: parseInt(id)
                })
                
            })
            let data = await response.json()
            
            if (response.status === 401) {
                const newtoken = await Refresh_token()
                if (newtoken) {
                    response = await fetch(`${import.meta.env.VITE_API_URL}/auth/ajout_film/`, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    credentials:"include",
                    body: JSON.stringify({
                        tmdb_id: parseInt(id)
                    })             
                    })
                    data = await response.json()
                } else {
                    console.log('refresh failed')
                    return
                }
            }

            if (response.ok) {
                showSnackbar('ajouté au favori', 'success')
            } else {
                showSnackbar('erreur', 'error')
                return
            }
        } catch(error) {
            console.error('erreur', error)
        } finally {
            setloading(false)
        }
    }
    const supprimer = async(tmdb_id) => {
        try {
            let response = await fetch(`${import.meta.env.VITE_API_URL}/auth/supprimer/${tmdb_id}/`, {
                method:'DELETE',
                credentials:'include'
            }) 
            if (response.status === 401) {
              const newtoken = await Refresh_token()
              if (newtoken) {
                response = await fetch(`${import.meta.env.VITE_API_URL}/auth/supprimer/${tmdb_id}/`, {
                method:'DELETE',
                credentials:'include'})
              } else {
                return
              }
            }
            if (response.ok) {
              showSnackbar('film retiré des favories', 'success')
              
            }
        } catch(error) {
            console.error('impossible de supprimer', error)
        }
    }

    return {Favori, loading, supprimer}

}