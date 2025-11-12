
import { createContext, useContext, useEffect, useState } from "react";


const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export default function AuthProvider({children}) {

    const [IsAuth, setIsAuth] = useState(false)
    const [loading, setloading] = useState(true)


    useEffect(()=>{
        const token = localStorage.getItem('token')
        if (token) {
            setIsAuth(true)
        } else {
            setloading(false)
            console.log('pas de token connecté')
        }
    }, [])
    
    
    const Login = async(username, password) => {
        try {           
            const response = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })

            const data = await response.json()
            console.log('data :', data)

            if (!response.ok) {
                throw new Error(data.detail || 'Identifiants incorrects')
            }
            
            
            localStorage.setItem('token', data.access)
            localStorage.setItem('refreshToken', data.refresh)  
            
            localStorage.removeItem('refreshtoken')
            localStorage.removeItem('refresh_token')
        
            setIsAuth(true)
            
        } catch (error) {
            console.error('erreur de login', error)
            throw error
        }
    }

    const Logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    setIsAuth(false)
    alert('vous etes deconnecté')
    console.log('Déconnecté')
}

    return (
        <AuthContext.Provider value={{Login, Logout, IsAuth, setIsAuth, loading, setloading}}>
            {children}
        </AuthContext.Provider>
    )
}

