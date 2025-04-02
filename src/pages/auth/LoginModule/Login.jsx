import ActionButton from '../../../components/ActionButtonModule/ActionButton.jsx'
import { loginRedirect } from '../../../services/authService.js'
import styles from './Login.module.css'

function Login() {
    
    const startExternalLogin = async () => {
        try {
            loginRedirect()
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
        
        <ActionButton 
            label="Sign In"
            action={startExternalLogin}
            overrideStyles="frontPageButton"
        />
    </div>
  )
}

export default Login