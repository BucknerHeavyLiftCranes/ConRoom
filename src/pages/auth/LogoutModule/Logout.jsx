import { useUser } from '../../../../context/exports/useUser'
import styles from './Logout.module.css'
import { authKey } from '../../../../constants/keys/keys'
import ActionButton from '../../../components/ActionButtonModule/ActionButton'
import { useNavigate } from 'react-router-dom'

function Logout() {
  const { user, setUser } = useUser()
  const navigate = useNavigate()

  /**
   * Redirect current user to external Microsoft logout
   */
  const endUserSession = async () => {
      setUser(null) // now everywhere in the app will know who the user is
      window.location.href = `${authKey}/logout`
  
  }
  
    
  return (
    <div className={styles.logoutContainer}>
      <header className={styles.pageTitle}>
        Are you sure you want log out, {user?.name.split(" ")[0] || "Guest"}...
      </header>
      
      <br/>
      
      <div className={styles.buttonControls}>
          <ActionButton
            label="Yes"
            action={endUserSession}
            overrideStyles='yesButton'
          />

          <ActionButton
            label="No"
            action={() => {setTimeout(() => {navigate('/home')}, 800)}}
            overrideStyles='noButton'
          />
      </div>
    </div>
  )
}

export default Logout