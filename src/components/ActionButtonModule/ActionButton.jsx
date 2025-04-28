import PropTypes from 'prop-types'
import styles from './ActionButton.module.css'


/**
 * A button that performs a specified action.
 * @param {Object} props
 * @param {string} [props.label] Label for the button.
 * @param {Function} [props.action] Action performed when the button is clicked.
 * * @param {boolean} [props.isDisabled] Whether button is disabled or not.
 * @param {string} [props.overrideStyles] If given, overrides default styling of the button.
 * @returns Functional labeled button that - optionally - performs an action.
 */
function ActionButton({ label, action, isDisabled, overrideStyles }) {
  let styleClass = overrideStyles ? styles[overrideStyles] : styles.actionButton
  
  const handleOnClick = (fn) => {
    if (fn && typeof fn == "function"){
      fn()
    }
  }

  return (
    <button 
      style={isDisabled ? { backgroundColor: 'gray'} : null}
      className={styleClass} 
      onClick={() => {handleOnClick(action)}}
      disabled={isDisabled}>
        {label}
    </button>
  )
}

ActionButton.propTypes = {
  label: PropTypes.string.isRequired,  // title is a required string
  action: PropTypes.function,
  isDisabled: PropTypes.bool,
  overrideStyles: PropTypes.string
};

export default ActionButton