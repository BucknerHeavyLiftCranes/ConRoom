import { makeRoute } from '../../../services/apiService.js'
import { useAuth } from '../../../../context/exports/useAuth.js'
import ActionButton from '../../../components/ActionButtonModule/ActionButton.jsx'
import styles from './Login.module.css'
import { Navigate } from 'react-router-dom';

function Login() {

    const { authenticated, loading } = useAuth();

    if (loading) {
        return null;
    }

    if (authenticated) {
        return <Navigate to="/room" replace />; // Might delete this later
    }
    
    /**
     * Redirect current user to external Microsoft login
     */
    const startExternalAdminLogin = async () => {
        try {
            if (authenticated) {
                return <Navigate to="/home" replace />; // incase app reloads and accidently throws user back to login page when they are already authenticated.
            }
            window.location.href = makeRoute("auth/login");
        } catch (err) {
            console.error(err.message)
        }
    }

    /**
     * Redirect current room to external Microsoft login
     */
    const startExternalRoomLogin = async () => {
        try {
            if (authenticated) {
                return <Navigate to="/room" replace />; // incase app reloads and accidently throws user back to login page when they are already authenticated.
            }
            window.location.href = makeRoute("auth/roomLogin");
        } catch (err) {
            console.error(err.message)
        }
    }

  return (
    <div className={styles.loginContainer}>
        {/* <header className={styles.pageTitle}>Buckner Conference</header>
        <header className={styles.pageTitle}>Room Scheduler</header> */}
        <header className={styles.pageTitle}>Buckner Heavylift Conference</header>
        <header className={styles.pageTitle}>Room Scheduler</header>

        
        <br/>
        
        <div className={styles.buttonControls}>
        <ActionButton 
            label="Login as Admin"
            action={startExternalAdminLogin}
            overrideStyles="frontPageAdminButton"
        />

        <ActionButton 
            label="Login as Room"
            action={startExternalRoomLogin}
            overrideStyles="frontPageRoomButton"
        />
        </div>
    </div>
  )
}

export default Login