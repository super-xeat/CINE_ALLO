
import { useEffect, useState } from "react"
import Button from "../context/button"


export default function Profil() {

    const [result, setresult] = useState({})
    const [loading, setloading] = useState(true)
    const [liste, setliste] = useState([])
    const [cache, setcache] = useState(false)

    const [username, setusername] = useState('')
    const [bio, setbio] = useState('')
    const [file, setfile] = useState(null)

    const [modiusername, setmodiusername] = useState(false)
    const [modifbio, setmodifbio] = useState(false)
    const [modifimage, setmodifimage] = useState(false)

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

    async function Envoyer(champ, champ2) {
        const token = localStorage.getItem('token')
        const formdata = new FormData()
        formdata.append(champ, champ2)

        try {
            const response = await fetch('http://localhost:8000/auth/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formdata
            })
            const data = await response.json()
            console.log('data envoyé', data)

            if (response.ok) {
                await Appel_profil()
            }
        } catch(error) {
            console.log('erreur', error)
        }
    }

    const cacheusername = () => (setmodiusername(!modiusername))
    const cachebio = () => (setmodifbio(!modifbio))
    const cacheimage = () => (setmodifimage(!modifimage))
    
    const handleusername = () => (Envoyer('username', username),setusername(''))
    const handlebio = () => (Envoyer('bio', bio),setbio(''))
    const handleimage = () => (Envoyer('image', file), setfile(null))


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
            {modiusername ? (
                <>
                <div>
                    <input type="text" onChange={(e)=>setusername(e.target.value)}
                    value={username}/>
                    <Button onClick={handleusername}>envoyer</Button>
                </div> 
                <div>
                    <Button onClick={cacheusername}>caché</Button>           
                </div>              
                </>                       
            ) : (
                <Button onClick={cacheusername}>Modifier</Button>
            )}

            <h2>Ma bio: {result.bio}</h2>
            {modifbio ? (
                <>
                <div>
                    <input type="text" onChange={(e)=>setbio(e.target.value)}
                    value={bio}/>
                    <Button onClick={handlebio}>envoyer</Button>
                </div>   
                <div>
                    <Button onClick={cachebio}>caché</Button>
                </div>          
                </>  
            ) : (
                <Button onClick={cachebio}>Modifier</Button>
            )}

            {result.image ? (
                <img src={'http://localhost:8000' + result.image}/>
            ) : (
                <p>pas d'image</p>
            )}  
            {modifimage ? (
                <>
                <div>
                    <input type="file" onChange={(e)=>setfile(e.target.files[0])}/>
                    <Button onClick={handleimage}>envoyer</Button>
                </div>  
                <div>
                    <Button onClick={cacheimage}>caché</Button>
                </div>  
                </>           
            ) : (
                <Button onClick={cacheimage}>Modifier</Button>
            )}

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
