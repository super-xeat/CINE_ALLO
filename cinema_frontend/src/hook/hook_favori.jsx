
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

    return {Favori, loading}

}