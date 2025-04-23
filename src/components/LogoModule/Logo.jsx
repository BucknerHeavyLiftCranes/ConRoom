import PropTypes from "prop-types"
import styles from "./Logo.module.css"

/**
 * @param {Object} props - Props for the logo component.
 * @param {string} props.source - Image source URL.
 * @param {string} props.alt - Alt text for the image.
 * @param {number} props.width - Width of the image in pixels.
 * @param {boolean} props.clickable - If the icon is clickable or not.
 * @param {Function} props.action - Action performed when the button is clicked (should only be passed if `clickable` is true).
 * @returns Resizable (potentionally clickable) logo.
 */
function Logo({ source, alt, width, clickable, action }) {
  const handleOnClick = (fn) => {
    if (clickable && fn && typeof fn == "function"){
      fn()
    }
  }

  if (clickable) {
    return (
      // <button>CLICK ME</button>
      <div style={{ width: `${width}px` }} className={styles.clickableLogo} onClick={() => {handleOnClick(action)}}>
          <img className={styles.logo} src={source} alt={alt}/>
      </div>
    )
  } else {
    return (
      <div style={{ width: `${width}px` }}>
          <img className={styles.logo} src={source} alt={alt}/>
      </div>
    )
  }
}

Logo.propTypes = {
    source: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    clickable: PropTypes.bool.isRequired,
    action: PropTypes.func
}

export default Logo