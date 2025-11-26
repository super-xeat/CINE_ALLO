
import { useNavigate } from "react-router-dom"


export default function useToken() {
    const navigate = useNavigate()

    const Refresh_token = async() => {
    try {
        
        const response = await fetch('http://localhost:8000/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        
        if (response.ok) {
                console.log('✅ Refresh réussi via cookies')
                return true
                
            } else {
                const errorText = await response.text()
                console.error('❌ Refresh failed:', response.status, errorText)
                throw new Error(`Refresh failed: ${response.status}`)
            }
        
    } catch(error) {
        console.error('erreur de refresh', error)
        navigate('/login')
        return false
    }
}
    
    return {Refresh_token}
}