

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Liste_films from "./page/liste_film";
import Detail from './page/detail_film';
import Recherche from "./components/recherche"
import Navbar from './components/navbar';
import Register from './page/inscription';


export default function App() {

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Recherche/>}/>
        <Route path="/detail_film/:id" element={<Detail/>}/>
        <Route path='/liste_films' element={<Liste_films/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    </Router>
  )
}