
import {Link, Navigate} from 'react-router-dom'
import { useAuth } from '../context/authcontext'
import Button from '../context/button'
import { useNavigate } from 'react-router-dom'



export default function Navbar() {

    const {IsAuth, Logout} = useAuth()
    const navigate = useNavigate()
    const handle = () => {
        Logout()
        navigate(-1)
    }

    return (
        <nav>
            <div>
                <Link to={'/'}>Accueil</Link>
                <Link to={'/liste_films'}>liste film</Link>
                <Link to={'/discover'}>Decouverte personnalisé</Link>
                <Link to={'/contact'}>contact</Link>
                <Link to={'/a_propos'}>a propos de nous</Link>
                
                {IsAuth ? (
                    <>
                    <Link to={'/profile'}>Profile</Link>
                    <Button onClick={handle}>Deconnexion</Button>
                    </>
                ) : (
                    <>
                    <Link to={'/login'}>login</Link>
                    <Link to={'/register'}>s'inscrire</Link>
                    </>
                )}              
            </div>
        </nav>
    )
}