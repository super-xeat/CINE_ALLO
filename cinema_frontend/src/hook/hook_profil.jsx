import { useState } from "react"
import useToken from "./hook_token"


export default function Hook_profil() {
    const [result, setResult] = useState({})
    const [loading, setLoading] = useState(true)
    const {Refresh_token} = useToken()

    const fetchProfil = async(setIsAuth, setuserauth) => {
    
        try {
            let response = await fetch('http://localhost:8000/auth/profile', {
                headers: { 
                    'Content-Type': 'application/json'  
                },
                credentials:'include'
            })

            console.log('📡 First response status:', response.status)

            if (response.status === 401) {
                console.log('🔄 Token expired - attempting refresh...')
                const newToken = await Refresh_token()
                console.log('📝 New token after refresh:', !!newToken)
                
                if (newToken) {
                    console.log('🚀 Second profile request with new token...')
                
                    response = await fetch('http://localhost:8000/auth/profile', {
                        headers: { 
                            'Content-Type': 'application/json'
                        },
                        credentials:'include'
                    })
                    console.log('📡 Second response status:', response.status)
                } else {
                    console.log('❌ Refresh completely failed')
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
            console.error('💥 Profile fetch error:', error)
            if (setIsAuth) setIsAuth(false)
        } finally {
            setLoading(false)
        }
    }
    
    return {fetchProfil, result, loading }
}