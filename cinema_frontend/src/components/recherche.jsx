
import { useState, useEffect } from "react";
import Button from "../context/button";
import Recherche_barre from "../hook/hook_recherche";
import { FaSearch } from "react-icons/fa";
import './recherche.css'


export default function Recherche() {

    const {fetch_recherche, query, setquery, result, loading} = Recherche_barre()
    
    function handlesubmit(e) {
        e.preventDefault()
        console.log('bouton cliqué', query)
        fetch_recherche(query)
    }
    console.log('data :', result)
    return(
        <div className="recherche">
            <form onSubmit={handlesubmit} className="formulaire">
                <div className="input-wrapper">
                    <input 
                        value={query} 
                        type="text" 
                        onChange={(e) => setquery(e.target.value)} 
                        placeholder="Rechercher un film..." 
                    />
                    <Button type="submit" className="search-btn">
                        <FaSearch />
                    </Button>
                </div>              
            </form>
            {loading && <p>Chargement...</p>}
            {result && (
            <>
            {result.film_detail && (
                <div>
                    <h2>Film_detail</h2>
                    <p>{result.film_detail.title}</p>
                    <p>{result.film_detail.overview}</p>
                </div>
            )}

            {result.film_similaire && result.film_similaire.length > 0 && (
                <>
                <h2>Films similaire</h2>

                    {result.film_similaire.map((item)=> ( 
                        <li key={item.id}>{item.original_title}</li>
                    ))}
                </>
            )}

            {result.film_recommande && result.film_recommande.length > 0 && (
                <>
                <h2>film recommandé</h2>
                    {result.film_recommande.map((item)=>(
                        <li key={item.id}>{item.title}</li>
                    ))}
                </>
            )}
            </>
            )}
        </div>
    )
}