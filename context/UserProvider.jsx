// src/context/UserContext.js
import { useState, useEffect } from 'react';
import { UserContext } from './exports/UserContext'
import PropTypes from 'prop-types';
import { makeRoute } from '../src/services/apiService.js';
import { fetchWithAuth, validateAndExtractResponsePayload } from '../src/services/apiService';


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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const startUserSession = async () => {
      try {
        const response = await fetchWithAuth(makeRoute("admin/current"), {
          credentials: "include"
        });
  
        const userData = await validateAndExtractResponsePayload(response, "Failed to set user details upon login")
        setUser(userData);
      } catch (err) {
        console.error("Failed to rehydrate user session", err);
      } finally {
        setLoading(false)
      }
    };
  
    startUserSession();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired
};
