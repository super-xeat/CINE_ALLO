import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Liste_films from "./page/liste_film";
import Detail from './page/detail_film';
import Recherche from "./components/recherche"
import Navbar from './components/navbar';
import Register from './page/inscription';
import Profil from './page/profil';
import LoginPage from './page/login';
import AuthProvider from './context/authcontext';
import Discover from './page/discover'
import Footer from './components/footer'
import Page_result from './components/resultat_page';
import Oubli_mdp from './page/oubli_mdp';
import Rest_password from './page/resetpassword';
import Propos from './page/propos';
import Alertprovider from './context/Alertcontext';
import Contact from './page/contact';
import CssBaseline from '@mui/material/CssBaseline';


export default function App() {

  return (
    
    <Router>
      <CssBaseline/>
      <Alertprovider>
      <AuthProvider>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Recherche/>}/>
          <Route path="/detail_film/:type/:id" element={<Detail/>}/>
          <Route path='/liste_films' element={<Liste_films/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/profile' element={<Profil/>}/>
          <Route path='/discover' element={<Discover/>}/>
          <Route path='/page_result' element={<Page_result/>}/>
          <Route path='/reset-password' element={<Rest_password/>}/>
          <Route path='/oubli-mdp' element={<Oubli_mdp/>}/>
          <Route path='/propos' element={<Propos/>}/>
          <Route path='/contact' element={<Contact/>}/>
        </Routes>
        <Footer/>       
      </AuthProvider>
      </Alertprovider>
    </Router> 
  )
}