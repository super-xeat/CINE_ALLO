import { Link } from 'react-router-dom';
import { useAuth } from '../context/authcontext';
import Button from '../context/button';
import { useNavigate } from 'react-router-dom';
import './navbar.css';

export default function Navbar() {
  const { IsAuth, Logout } = useAuth();
  const navigate = useNavigate();

  const handle = () => {
    Logout();
    navigate(-1);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">CINE ALLO</Link>

        <div className="nav-links">
          <Link to="/">Accueil</Link>
          <Link to="/liste_films">Liste Films</Link>
          <Link to="/discover">Découverte personnalisée</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/a_propos">À propos</Link>

          {IsAuth ? (
            <>
              <Link to="/profile">Profil</Link>
              <Button onClick={handle}>Déconnexion</Button>
            </>
          ) : (
            <>
              <Link to="/login">Connexion</Link>
              <Link to="/register">S’inscrire</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
