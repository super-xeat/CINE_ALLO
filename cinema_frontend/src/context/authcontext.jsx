
import { createContext, useContext, useEffect, useState } from "react";


const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

function AuthProvider({children}) {

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
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            if (!response.ok) {
                console.log('erreur')
            }
            const token = await response.json()
            localStorage.setItem('token', token.access)
            setIsAuth(true)
            
        } catch (error) {
            console.error('erreur de login')
        }
    }

    const Logout = async () => {
        try {
            const token = localStorage.getItem('token')
            await fetch('http://localhost:8000/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-type':'application/json',
                    'Authorization':`Bearer ${token}`
                }
            })

            localStorage.removeItem('token')
            setIsAuth(false)
            alert('vous etes deconnecté')
        } catch(error) {
            console.error('probleme appel api')
            localStorage.removeItem('token')
        }
        
    }

    return (
        <AuthContext.Provider value={{Login, Logout, IsAuth, setIsAuth, loading, setloading}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider