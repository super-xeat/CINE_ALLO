
import { useAuth } from "../context/authcontext"
import Button from "../context/button"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSearchParams } from "react-router-dom"


export default function LoginPage() {

    const navigate = useNavigate()
    const {Login} = useAuth()
    const [password, setpassword] = useState('')
    const [username, setusername] = useState('')
    const [searchparams] = useSearchParams()
    const statut = searchparams.get('statut')

    useEffect(()=> {
        if (statut || statut === 'success' ) {
        alert('compte créé avec succée')
    }
    }, [statut])
    
    function handlesubmit(e) {
        e.preventDefault()
        Login(username, password)
        navigate(-1)
        setusername('')
        setpassword('')
    }

    return (
        <div>
            <form onSubmit={handlesubmit}>
                <input onChange={(e)=>setusername(e.target.value)}
                type="text" value={username} placeholder="username"/>

                <input onChange={(e)=>setpassword(e.target.value)}
                type="password" value={password} placeholder="password"/>

                <Button type='submit'>se connecter</Button>
            </form>
        </div>
    )
}