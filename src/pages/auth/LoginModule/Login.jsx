import { makeRoute } from '../../../../constants/keys/keys.js'
import { useAuth } from '../../../../context/exports/useAuth.js'
import ActionButton from '../../../components/ActionButtonModule/ActionButton.jsx'
import styles from './Login.module.css'
import { Navigate } from 'react-router-dom';

function Login() {

    const { authenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // or a spinner
    }

    if (authenticated) {
        return <Navigate to="/home" replace />;
    }
    
    /**
     * Redirect current user to external Microsoft login
     */
    const startExternalAdminLogin = async () => {
        try {
            window.location.href = makeRoute("auth/login");
        } catch (err) {
            console.error({message: err.message, stack: err.stack})
        }
    }

    /**
     * Redirect current room to external Microsoft login
     */
    const startExternalRoomLogin = async () => {
        try {
            // window.location.href = `${authKey}/login`;
        } catch (err) {
            console.error({message: err.message, stack: err.stack})
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