import PropTypes from 'prop-types'
import styles from './ActionButton.module.css'


function ActionButton({ title, action }) {
  
  const handleOnClick = (fn) => {
    if(fn &&typeof fn == "function"){
      fn()
    }
  }

  return (
    <button className={styles.actionButton} onClick={() => {handleOnClick(action)}}>{title}</button>
  )
}

ActionButton.propTypes = {
  title: PropTypes.string.isRequired,  // title is a required string
  action: PropTypes.function
};

export default ActionButton