import { useUser } from '../../../../context/exports/useUser'
import styles from './Logout.module.css'
import { makeRoute } from '../../../services/apiService.js'
import ActionButton from '../../../components/ActionButtonModule/ActionButton'
import { useNavigate } from 'react-router-dom'

function Logout() {
  const { user, setUser, loading } = useUser()
  const navigate = useNavigate()

  /**
   * Redirect current user to external Microsoft logout
   */
  const endUserSession = async () => {
      setUser(null) // remove knowledge of user from the website
      window.location.href = makeRoute("auth/logout")
  
  }

  if (loading) {
    return null
  }

  if(!user.name) {
    user.name = ""
  }
  
  return (
    <div className={styles.logoutContainer}>
      <header className={styles.pageTitle}>
        Are you sure you want log out, {user ? (loading ? "" : user.name.split(" ")[0]) : ""} 
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
            action={() => {setTimeout(() => {navigate(-1)}, 800)}}
            overrideStyles='noButton'
          />
      </div>
    </div>
  )
}

export default Logout