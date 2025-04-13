import { useContext } from 'react';
import { UserContext } from './UserContext';

/**
 * Set and access details about the currently logged in user.
 * @returns {{user: {id: string, name: string, email: string}|null, setUser: function}} [user, setUser]
 */
export const useUser = () => useContext(UserContext);