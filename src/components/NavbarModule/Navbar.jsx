// import PropTypes from "prop-types"
import styles from "./Navbar.module.css"
import Logo from "../LogoModule/Logo"
// import f from "../../../Buckner_Heavylift_Black.png"

/**
 * 
 * @returns Functional navigation bar with links to navigate the website.
 */
function Navbar() {
  return (
    <nav className={styles.navContainer}>
        <div className={styles.logo}>
            <Logo
                source="../../../Buckner_Heavylift_Black.png"
                alt="Buckner logo in black"
                width={200}
            />
        </div>
        <a className={styles.navLink} href="/room">Room Status</a>
        <a className={styles.navLink} href="/logout">Logout</a>
    </nav>
  )
}

export default Navbar