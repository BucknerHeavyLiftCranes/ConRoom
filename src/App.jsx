import BodyBackgroundWrapper from './components/BodyBackgroundWrapper.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Login from './pages/auth/LoginModule/Login.jsx';
import RoomStatus from './pages/RoomStatusModule/RoomStatus.jsx';
// import viteLogo from '/vite.svg'
// import './App.css'

function App() {
  return(
    <>
      <Router>
        <BodyBackgroundWrapper />
        <Routes>
        <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/room" element={<RoomStatus />} />
        </Routes>
      </Router>
    </>
  )
}

export default App