import styles from './Home.module.css'

function Home() {

  const startExternalLogin = () => {
    console.log("Start log in!")
  }

  return (
    <div className={styles.homeBody}>

      <h1 className={styles.pageTitle}>Home</h1>
      <div>
        gipvvjefvpievjpievjip
      </div>    
      <button onClick={startExternalLogin}>Login</button>

    </div>
  )
}

export default Home