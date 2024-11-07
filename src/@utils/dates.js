import moment from 'moment';
import { Timestamp } from 'firebase/firestore';

/**
 * Converts a Firebase Timestamp to a formatted date string.
 * @param {Timestamp} timestamp - The Firebase Timestamp object.
 * @param {string} format - The desired date format string.
 * @returns {string} The formatted date string.
 */
export const formatFirebaseTimestamp = (timestamp, format = 'DD/MM/YYYY') => {
  if (timestamp instanceof Timestamp) {
    return moment(timestamp.toDate()).format(format);
  } else if (timestamp instanceof Date) {
    return moment(timestamp).format(format);
  }
  return '';
};

// export default formatFirebaseTimestamp;
