import { BrowserRouter as Router, Routes, Route } from 'react-router';

import Select from './Select'
import './App.css'
import Livingroom from './Livingroom';
import NewGame from './Newgame';
import AboutUsPage from './AboutUs';
import Login from './Login';
import HamGame from './hamGame/hamGame';




function App() {
  
  return (
    <>
      <Router>
        <Routes>
          <Route path="/Select" element={<Select />} />
          <Route path="/Livingroom/:id" element={<Livingroom />} />
          <Route path="/Newgame" element={<NewGame />} />
          <Route path="/Aboutus" element={<AboutUsPage />} />
          <Route path="/Login" element={<Login />} />
          <Route path='/HamGame' element={<HamGame/>}/>
          <Route path='/' element={<Login/>}/>
        </Routes>
      </Router>
      <div>This is not our web Page!</div>
    </>
  )
}

export default App
