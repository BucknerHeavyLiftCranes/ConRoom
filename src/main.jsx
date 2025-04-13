import { StrictMode } from 'react' // dev-only tool to catch bugs early (i.e. duplicates calls to useEffect and useState)
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from '../context/UserProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode> 
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>,
)
