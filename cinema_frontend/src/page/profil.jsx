

import { useEffect, useState } from "react"
import Button from "../context/button"


export default function Profil() {

    const [result, setresult] = useState({})
    const [loading, setloading] = useState(true)
    const [liste, setliste] = useState([])
    const [cache, setcache] = useState(false)

    useEffect(()=> {
        async function Appel_profil() {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:8000/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (!response.ok) {
                console.log('erreur dans la reponse')
            }
            const data = await response.json()
            console.log('data :', data)
            setresult(data)

        } catch(error) {
            console.log('pas de data')
        } finally {
            setloading(false)
        }
        }
        Appel_profil()
    }, [])

    async function Liste_favori() {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:8000/auth/voir_liste', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                console.log('erreur')
            }

            const data = await response.json()
            console.log('data :', data)
            setliste(data)
        

        } catch (error) {
            console.error('erreur pas de data', error)
        } finally {
            setloading(false)
        }
    }

    function handlesubmit() {
        Liste_favori()
        setcache(true)
    }

    function Cache() {
        setcache(false)
    }

    if (loading) {
        return <div>Chargement...</div>
    }

    return (
        <div>
            <h1>Bienvenu {result.username}</h1>        
            <div>
                {!cache ? (
                    <>             
                    <Button onClick={handlesubmit}>Voir ma liste de favories</Button>
                    </>
                ) : (
                    <>
                    <Button onClick={Cache}>cacher</Button>
                    <h2>Votre liste de favories</h2>
                    {liste.map((item)=> (
                        <li key={item.id}>
                            <h3>film</h3>
                            {item.statut}
                            {item.date_ajout}
                        </li>
                    ))}
                    </>
                )}       
            </div>
        </div>
    )
}
