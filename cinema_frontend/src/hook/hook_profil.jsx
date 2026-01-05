import { useState } from "react"
import useToken from "./hook_token"


export default function Hook_profil() {
    const [result, setResult] = useState({})
    const [loading, setLoading] = useState(true)
    const {Refresh_token} = useToken()

    const fetchProfil = async(setIsAuth, setuserauth) => {
    
        try {
            let response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile/`, {
                headers: { 
                    'Content-Type': 'application/json'  
                },
                credentials:'include'
            })

            if (response.status === 401) {
                const newToken = await Refresh_token()
                console.log('refresh:', !!newToken)
                
                if (newToken) {
                    
                    response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile/`, {
                        headers: { 
                            'Content-Type': 'application/json'
                        },
                        credentials:'include'
                    })
                } else {
                    console.log('probleme de profil')
                    return
                }
            }

            if (response.ok) {
                const data = await response.json()
                setResult(data)
                
                if (setIsAuth) setIsAuth(true)
                if (setuserauth) setuserauth(data.email || data.username) 
            } else {
                if (setIsAuth) setIsAuth(false)
            }

        } catch (error) {
            if (setIsAuth) setIsAuth(false)
        } finally {
            setLoading(false)
        }
    }
    
    return {fetchProfil, result, loading }
}