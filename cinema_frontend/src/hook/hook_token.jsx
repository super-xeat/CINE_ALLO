

export default function useToken() {
    const Refresh_token = async() => {
    try {      
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })      
        if (response.ok) {
                return true              
            } else {
                return false
            }
        
    } catch(error) {
    
        return false
    }
} 
    return {Refresh_token}
}