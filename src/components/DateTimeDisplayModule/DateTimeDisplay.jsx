import {useState, useEffect} from 'react'
import styles from './DateTimeDisplay.module.css'


/**
 * Displays current date and time (based on local machine).
 * @returns A date and time display.
 */
function DateTimeDisplay() {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const intervalID =  setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => {clearInterval(intervalID)};
    
    }, []); //start time only when we mount the clock to the DOM;
    
    

    /**
     * Format the current time in EST
     * @returns the current time (HH:MM)
     */
    const formatTime = () => {
        let hours = dateTime.getHours().toString().padStart(2, 0);
        const mins = dateTime.getMinutes().toString().padStart(2, 0);
        // const secs = dateTime.getSeconds().toString().padStart(2, 0);

        // return `${hours}:${mins}`;
        // return `${hours}:${mins}:${secs}`;
    
        // if (format) {
        // 12-hour format
        // const meridiem = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert to 12-hour format
        return `${hours}:${mins}`; //return `${hours}:${mins} ${meridiem}`;
        // } else {
            // 24-hour format
            // return `${hours}:${mins}`;
        // }
    }

    /**
     * Format the current date in EST
     * @returns the current date (i.e Tuesday, April 01)
     */
    const formatDate = () => {
        const options = {
            weekday: 'long', // Get short day name (e.g., "Tue")
            day: '2-digit', // Get two-digit day (e.g., "25")
            month: 'long', // Get full month name (e.g., "March")
            // year: 'numeric' // Get full year (e.g., "2025")
        };
    
        return dateTime.toLocaleDateString('en-US', options);
    }


    return (
        <div className={styles.dateTimeDisplay}>
            <div className={styles.time}>
                <span>{formatTime()}</span>
            </div>
            <div className={styles.date}>
                <span>{formatDate()}</span>
            </div>
        </div>
    )
}

export default DateTimeDisplay