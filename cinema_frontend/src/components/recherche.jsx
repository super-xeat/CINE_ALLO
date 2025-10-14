

import { useState, useEffect } from "react";
import Button from "../context/button";
import Recherche_barre from "../hook/hook_recherche";


export default function Recherche() {

    const {fetch_recherche, setquery, result, loading} = Recherche_barre()
    
    function handlesubmit(e) {
        e.preventDefault()
        fetch_recherche(query)
    }
    
    return(
        <div>
            <form onSubmit={handlesubmit}>
                <input value={query} type="text" onChange={(e)=>setquery(e.target.value)}/>             
                <Button type='submit'>
                    rechercher
                </Button>
            </form>
            {loading && <p>Chargement...</p>}
            {result && 
            <>
            {result.film_detail}
            {result.film_similaire}
            {result.film_recommande}
            </>
            }
        </div>
    )
}