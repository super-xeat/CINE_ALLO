

import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Liste_films from "./components/liste_film";




export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Liste_films/>}/>
      </Routes>
    </Router>
  )
}