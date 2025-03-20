import PropTypes from 'prop-types'
import styles from './ActionButton.module.css'


/**
 * A button that performs a specified action
 * @param label - label for the button
 * @param action - the action (function) performed when the button is clicked
 * @returns ActionButton component
 */
function ActionButton({ label, action }) {
  
  const handleOnClick = (fn) => {
    if(fn && typeof fn == "function"){
      fn()
    }
  }

  return (
    <button className={styles.actionButton} onClick={() => {handleOnClick(action)}}>{label}</button>
  )
}

ActionButton.propTypes = {
  label: PropTypes.string.isRequired,  // title is a required string
  action: PropTypes.function
};

export default ActionButton