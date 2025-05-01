import PropTypes from 'prop-types'
import styles from "./FullScreenPopup.module.css";
import ActionButton from '../ActionButtonModule/ActionButton';

/**
 * A full screen popup for displaying various information.
 * @param {Object} props 
 * @param {boolean} [props.isOpen] whether the popup is open or not.
 * @param {Function} [props.onClose] handler for closing the popup and deleting its information.
 * @param {string} [props.label] title describing the popup's content.
 * @param {boolean} [props.darkModeF] Whther or not the display is in dark mode
 * @param {Node} [props.children] information to display on the popup.
 * @returns a popup that covers the entire window.
 */
function FullScreenPopup ({ isOpen, onClose, label, darkMode, children,  }) {
    if (!isOpen) return null;
    
    return (
        <div className={styles.overlay} /*onClick={onClose}*/>
            <div 
                className={darkMode ? styles.popupDarkMode : styles.popup} 
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.closeButtonContainer}>
                    <ActionButton
                        label="×"
                        action={onClose}
                        overrideStyles='closePopupButton'
                    />
                </div>
                
                {label && label !== "" ? <h2 className={darkMode ? styles.labelDarkMode : styles.label}>
                    {label}
                </h2> : null}
                
                {children}
            </div>
        </div>
    );
};

FullScreenPopup.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    label: PropTypes.string,
    darkMode: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired
};

export default FullScreenPopup;
