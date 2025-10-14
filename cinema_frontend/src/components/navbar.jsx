
import {Link} from 'react-router-dom'
import Recherche_barre from '../hook/hook_recherche'

export default function Navbar() {

    return (
        <nav>
            <div>
                <Link to={'/'}>Accueil</Link>
                <Link to={'/liste_film'}>liste film</Link>
                <Link to={'/contact'}>contact</Link>
                <Link to={'/a_propos'}>a propos de nous</Link>
                <Link to={'/login'}>login</Link>
            </div>
        </nav>
    )
}