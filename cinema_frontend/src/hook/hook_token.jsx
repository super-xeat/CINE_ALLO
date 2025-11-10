
import { useNavigate } from "react-router-dom"


export default function useToken() {
    const navigate = useNavigate()

    const Refresh_token = async() => {
    const refreshtoken = localStorage.getItem('refreshToken')
    
    if (!refreshtoken) {
        console.log('AUCUN refresh token - redirection login')
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
        return null
    }

    try {
        
        const response = await fetch('http://localhost:8000/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({refresh: refreshtoken})
        })
       
        const responseText = await response.text()
        
        if (response.ok) {
            console.log('Refresh RÉUSSI - parsing JSON...')
            try {
                const data = JSON.parse(responseText)
                
                localStorage.setItem('token', data.access)
                if (data.refresh) {
                    localStorage.setItem('refreshToken', data.refresh);
                    console.log('Nouveau refresh token stocké')
                }
                
                return data.access

            } catch (parseError) {
                throw new Error('Invalid JSON response')
            }

        } else {
            throw new Error(`Refresh failed with status ${response.status}: ${responseText}`)
        }
        
    } catch(error) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login')
        return null
    }
}
    
    return {Refresh_token}
}