import React from "react";
import "./Footer.css";
import { FaXTwitter, FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo & Description */}
        <div className="footer-section brand">
          <h2 className="footer-logo">TMDb Explorer</h2>
          <p className="footer-text">
            Découvrez les meilleurs films et séries grâce à l’API The Movie Database.
          </p>
        </div>

        {/* Liens rapides */}
        <div className="footer-section links">
          <h3>Navigation</h3>
          <ul>
            <li><a href="/">Accueil</a></li>
            <li><a href="/about">À propos</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Réseaux sociaux */}
        <div className="footer-section social">
          <h3>Suivez-nous</h3>
          <div className="social-icons">
            <a href="https://x.com" target="_blank" rel="noreferrer"><FaXTwitter /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
            <a href="https://github.com" target="_blank" rel="noreferrer"><FaGithub /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} TMDb Explorer. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
