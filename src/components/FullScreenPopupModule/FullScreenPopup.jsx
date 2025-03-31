import PropTypes from 'prop-types'
import styles from "./FullScreenPopup.module.css";
import ActionButton from '../ActionButtonModule/ActionButton';

/**
 * A full screen popup for displaying various information.
 * @param {Object} props 
 * @param {boolean} [props.isOpen] whether the popup is open or not.
 * @param {Function} [props.onClose] handler for closing the popup and deleting its information.
 * @param {Node} [props.children] information to display on the popup.
 * @returns a popup that covers the entire window.
 */
function FullScreenPopup ({ isOpen, onClose, children }) {
    if (!isOpen) return null;
    
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>✖</button>
                {children}
                <ActionButton
                    label="close"
                    action={onClose}
                />
            </div>
        </div>
    );
};

FullScreenPopup.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

export default FullScreenPopup;
