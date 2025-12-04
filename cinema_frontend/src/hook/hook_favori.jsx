
import { useState } from "react";
import useToken from "./hook_token";

export default function Hook_favori() {
    
    const [loading, setloading] = useState(false)
    const {Refresh_token} = useToken()

    async function Favori(id) {
        setloading(true)
        try {

            let response = await fetch('http://localhost:8000/auth/ajout_film', {
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
            console.log('data :', data)
            
            if (response.status === 401) {
                const newtoken = await Refresh_token()
                if (newtoken) {
                    console.log('nouveau token favori')
                    response = await fetch('http://localhost:8000/auth/ajout_film', {
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
                    console.log('data refresh:', data)
                } else {
                    console.log('refresh failed')
                    return
                }
            }

            if (response.ok) {
                alert('film ajouté au favori')
                console.log('film ajouté au favori', response.status)
            } else {
                alert('erreur')
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
            let response = await fetch(`http://localhost:8000/auth/supprimer/${tmdb_id}`, {
                method:'DELETE',
                credentials:'include'
            }) 
            if (response.status === 401) {
              const newtoken = await Refresh_token()
              if (newtoken) {
                response = await fetch(`http://localhost:8000/auth/supprimer/${tmdb_id}`, {
                method:'DELETE',
                credentials:'include'})
              } else {
                console.log('erreur de refresh')
                return
              }
            }
            if (response.ok) {
              alert('element supprimé')
              console.log('element supprimé')
              
            }
        } catch(error) {
            console.error('impossible de supprimer', error)
        }
    }

    return {Favori, loading, supprimer}

}