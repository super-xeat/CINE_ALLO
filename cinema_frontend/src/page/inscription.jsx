
import { useState, useEffect } from "react"
import Button from '../context/button'


export default function Register() {

    const [username, setusername] = useState('')
    const [bio, setbio] = useState('')
    const [identifiant, setidentifiant] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [confimpassword, setconfirmpassword] = useState('')

    function handlesubmit(e) {
        e.preventDefault()
        Inscription()
        setusername('')
        setbio('')
        setidentifiant('')
        setemail('')
    }

    
    async function Inscription() {
        try {
            const response = await fetch('http://localhost:8000/auth/register', {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({
                    username: username,
                    bio: bio,
                    identifiant:identifiant,
                    email:email,
                    password:password,
                    confirm_password: confimpassword
                })
            })
            if (!response) {
                console.log('pas de reponse')
            }
            const data = await response.json()
            console.log('data :', data)

        } catch(error) {
            console.error('erreur de useeffect')
        }
    }
    
    
    return(
        <div>
            <form onSubmit={handlesubmit}>
                <input onChange={(e)=>setusername(e.target.value)} 
                type="text" value={username} placeholder="name"/>

                <input onChange={(e)=>setbio(e.target.value)} 
                type="text" value={bio} placeholder="bio"/>

                <input onChange={(e)=>setidentifiant(e.target.value)} 
                type="text" value={identifiant} placeholder="identifiant"/>
                
                <input onChange={(e)=>setemail(e.target.value)} 
                type="text" value={email} placeholder="email"/>

                <input onChange={(e)=>setpassword(e.target.value)} 
                type="text" value={password} placeholder="password"/>

                <input onChange={(e)=>setconfirmpassword(e.target.value)} 
                type="text" value={confimpassword} placeholder="confirm"/>
                           
            <Button type='submit'>envoyer</Button>
            </form>
        </div>
    )
}