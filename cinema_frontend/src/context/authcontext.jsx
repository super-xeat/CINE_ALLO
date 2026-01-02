
import { createContext, useContext, useEffect, useState } from "react";
import Hook_profil from "../hook/hook_profil"


const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
    }
    return context;
}

export default function AuthProvider({children}) {

    const [IsAuth, setIsAuth] = useState(false)
    const [loading, setloading] = useState(true)
    const [userauth, setuserauth] = useState('')
    const {fetchProfil} = Hook_profil()
    

    useEffect(()=> {      
        const initAuth = async () => {
            await fetchProfil(setIsAuth, setuserauth)
            setloading(false) 
        }
        initAuth()
    }, [])

    const Login = async(email, password) => {
        try {           
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials:'include',
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            
            
            const data = await response.json()
            console.log('data :', data)

            if (response.status === 403 || response.status === 401) {
                console.error("Session corrompue, nettoyage forcé...");
            
                await fetch(`${import.meta.env.VITE_API_URL}/auth/force_logout/`, 
                    { method: 'GET',
                    credentials: 'include' });
                
                setIsAuth(null); 
                return false; 
            }
            
            if (!response.ok) {
                const errorMsg = data.detail || (data.non_field_errors && data.non_field_errors[0]) || 'Erreur de connexion';
                throw new Error(errorMsg)
            }
            
            setuserauth(email)
            setIsAuth(true)
            return true

        } catch (error) {
            console.error('erreur de login', error)
            throw error
        }
    }

    const Logout = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
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

