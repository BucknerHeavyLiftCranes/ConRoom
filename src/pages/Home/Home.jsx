import ActionButton from '../../components/ActionButtonModule/ActionButton'
import styles from './Home.module.css'

function Home() {

  const startExternalLogin = () => {
    console.log("Start log in!")
  }

  return (
    <>
      <h1 className={styles.pageTitle}>Home</h1>
      <div>
        gipvvjefvpievjpievjip
      </div>    
      <ActionButton 
        title="Log In"
        action={startExternalLogin}
      />
    </>
  )
}

export default Home