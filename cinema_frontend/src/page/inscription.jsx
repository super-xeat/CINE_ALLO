
import { useState, useEffect } from "react"
import Button from '../context/button'


export default function Register() {

    const [username, setusername] = useState('')
    const [bio, setbio] = useState('')
    const [identifiant, setidentifiant] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [file, setfile] = useState(null)
    const [confimpassword, setconfirmpassword] = useState('')

    function handlesubmit(e) {
        e.preventDefault()
        Inscription()
        setusername('')
        setbio('')
        setidentifiant('')
        setemail('')
        setfile(null)
    }

    
    async function Inscription() {
        const formdata = new FormData()
        formdata.append('image', file)
        formdata.append('username', username)
        formdata.append('bio', bio)
        formdata.append('identifiant', identifiant)
        formdata.append('email', email)
        formdata.append('password', password)

        try {
            const response = await fetch('http://localhost:8000/auth/register', {
                method: 'POST',
                body: formdata
            })

            const data = await response.json()
            console.log('data envoyé', data)
        } catch(error) {
            console.error('erreur de formdata', error)
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

                <input type="file" onChange={(e)=>setfile(e.target.files[0])}
                value={file}/>       
            <Button type='submit'>envoyer</Button>
            </form>
        </div>
    )
}