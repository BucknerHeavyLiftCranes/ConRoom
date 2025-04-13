// src/context/UserContext.js
import { useState } from 'react';
import { UserContext } from './exports/UserContext'
import PropTypes from 'prop-types';


/**
 * Wrapper that provides details about the current user to the app.
 * @param {Object} props
 * @param {ReactNode} [props.children] Child element to be given access to user details.
 * @returns Content that needs access to the user's details.
 */
export const UserProvider = ({ children }) => {
  /**
   * Holds the current user's session info retrieved from the backend.
   * `null` when no user is logged in.
   * @type {[{id: string, name: string, email: string}|null, function]} [user, setUser]
   */
  const [user, setUser] = useState(null); // { id, name, email }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired
};
