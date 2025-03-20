import BodyBackgroundWrapper from './components/BodyBackgroundWrapper.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
// import viteLogo from '/vite.svg'
// import './App.css'

function App() {
  return(
    <>
      <Router>
        <BodyBackgroundWrapper />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </>
  )
}

export default App