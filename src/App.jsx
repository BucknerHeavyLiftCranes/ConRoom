import BodyBackgroundWrapper from './components/BodyBackgroundWrapper.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import Home from './pages/Home/Home.jsx';
import Login from './pages/auth/LoginModule/Login.jsx';
import RoomStatus from './pages/RoomStatusModule/RoomStatus.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Logout from './pages/auth/LogoutModule/Logout.jsx';
import { AuthProvider } from '../context/AuthProvider.jsx';
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
            
            {/* <Route 
              path="/home" 
              element={
                <ProtectedRoute redirectTo='/'>
                  <Home />
                </ProtectedRoute>
              } 
            /> */}

            <Route 
              path="/room" 
              element={
                <ProtectedRoute redirectTo='/'>
                  <RoomStatus />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/logout" 
              element={
                <ProtectedRoute redirectTo='/'>
                  <Logout />
                </ProtectedRoute>
              } 
            />
          
          </Routes>
        </Router>
      </AuthProvider>
  )
}

export default App