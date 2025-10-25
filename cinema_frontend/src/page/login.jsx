
import { useAuth } from "../context/authcontext"
import Button from "../context/button"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


export default function LoginPage() {

    const navigate = useNavigate()
    const {Login} = useAuth()
    const [password, setpassword] = useState('')
    const [username, setusername] = useState('')

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