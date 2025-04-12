import BodyBackgroundWrapper from './components/BodyBackgroundWrapper.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Login from './pages/auth/LoginModule/Login.jsx';
import { AuthProvider } from '../context/AuthProvider.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
// import viteLogo from '/vite.svg'
// import './App.css'

function App() {
  // const validateSession = async () => {} 
  // make a request for userData
  // if request returns valid data, user is logged in and should render rest of the app
  // else, render the login page

  return(
      <AuthProvider>
        <Router>
          <BodyBackgroundWrapper />
          <Routes>
            
            <Route 
              path="/" 
              element={<Login />} 
            />
            
            <Route 
              path="/home" 
              element={
                <ProtectedRoute redirectTo='/'>
                  <Home />
                </ProtectedRoute>
              } 
            />
          
          </Routes>
        </Router>
      </AuthProvider>
  )
}

export default App