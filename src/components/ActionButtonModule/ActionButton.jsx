import PropTypes from 'prop-types'
import styles from './ActionButton.module.css'


/**
 * A button that performs a specified action.
 * @param {Object} props
 * @param {string} [props.label] Label for the button.
 * @param {Object} [props.overrideStyles] If given, overrides default styling of the button.
 * @param {Function} [props.action] Action (function) performed when the button is clicked.
 * @returns Functional labeled button that - optionally - performs an action.
 */
function ActionButton({ label, action, overrideStyles }) {
  let styleClass = overrideStyles ? styles[overrideStyles] : styles.actionButton
  
  const handleOnClick = (fn) => {
    if (fn && typeof fn == "function"){
      fn()
    }
  }

  return (
    <button 
      className={styleClass} 
      onClick={() => {handleOnClick(action)}}>
        {label}
    </button>
  )
}

ActionButton.propTypes = {
  label: PropTypes.string.isRequired,  // title is a required string
  action: PropTypes.function,
  overrideStyles: PropTypes.string
};

export default ActionButton