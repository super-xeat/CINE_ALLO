import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/authcontext"
import useToken from "./hook_token"

export default function Hook_profil() {
    const [result, setResult] = useState({})
    const [loading, setLoading] = useState(true)
    const {setIsAuth} = useAuth()
    const {Refresh_token} = useToken()
    const navigate = useNavigate()

    const fetchProfil = async() => {
        console.log('🍪 Cookies before request:', document.cookie)
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
                    await new Promise(resolve => setTimeout(resolve, 500))
                    response = await fetch('http://localhost:8000/auth/profile', {
                        headers: { 
                            'Content-Type': 'application/json'
                        },
                        credentials:'include'
                    })
                    console.log('📡 Second response status:', response.status)
                } else {
                    console.log('❌ Refresh completely failed')
                    setIsAuth(false)
                    navigate('/login')
                    return
                }
            }

            if (response.ok) {
                console.log('✅ Profile fetch SUCCESS')
                const data = await response.json()
                setResult(data)
                setIsAuth(true)
            } else {
                console.log('❌ Final profile fetch failed:', response.status)
                throw new Error(`Profile fetch failed: ${response.status}`)
            }

        } catch (error) {
            console.error('💥 Profile fetch error:', error)
            setIsAuth(false)
            navigate('/login')
        } finally {
            setLoading(false)
        }
    }
    
    return {fetchProfil, result, loading }
}