import PropTypes from "prop-types"
import styles from "./Logo.module.css"

/**
 * @param {Object} props - Props for the logo component.
 * @param {string} props.source - Image source URL.
 * @param {string} props.alt - Alt text for the image.
 * @param {number} props.width - Width of the image in pixels.
 * @returns Resizable logo.
 */
function Logo({ source, alt, width }) {
  return (
    <div style={{ width: `${width}px` }}>
        <img className={styles.logo} src={source} alt={alt}/>
    </div>
  )
}

Logo.propTypes = {
    source: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired
}

export default Logo