
import { createContext, useContext, useEffect, useState } from "react";
import Hook_profil from "../hook/hook_profil";

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export default function AuthProvider({children}) {

    const [IsAuth, setIsAuth] = useState(false)
    const [loading, setloading] = useState(true)
    const [userauth, setuserauth] = useState('')
    const {fetchProfil} = Hook_profil(setIsAuth)

    useEffect(()=> {      
        fetchProfil()
    }, [])

    const Login = async(username, password) => {
        try {           
            const response = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials:'include',
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
            
            setuserauth(username)
            setIsAuth(true)
            
        } catch (error) {
            console.error('erreur de login', error)
            throw error
        }
    }

    const Logout = async () => {
        try {
            await fetch('http://localhost:8000/auth/logout', {
                method: 'POST',
                credentials: 'include' 
            })
        } catch (error) {
            console.error('❌ Erreur lors du logout:', error)
        } finally {
            setIsAuth(false)
            setuserauth('')
            console.log('Déconnecté')
        }
    }


    return (
        <AuthContext.Provider value={{userauth, Login, Logout, IsAuth, setIsAuth, loading, setloading}}>
            {children}
        </AuthContext.Provider>
    )
}

