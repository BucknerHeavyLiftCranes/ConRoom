// AuthContext.jsx
import { useEffect, useState } from 'react';
import { AuthContext } from './exports/AuthContext';
import PropTypes from 'prop-types';
import { makeRoute } from '../src/services/apiService.js';
import { fetchWithAuth } from '../src/services/apiService';


/**
 * Wrapper that protects routes by requiring a user be authenticated first.
 * @param {Object} props
 * @param {ReactNode} [props.children] Child element to protected by user authentication.
 * @returns Content the user is allowed to access.
 */
export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        /**
         * Verify the user has logged in.
         */
        const verifyUser = async () => {
        try {
            const response = await fetchWithAuth(makeRoute("auth/validate"), {
            credentials: 'include'
            });
    
            if (response.ok) {
              setAuthenticated(true);
            } else {
              setAuthenticated(false);
            }
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
        };
    
        verifyUser();
    }, []);
  


  return (
    <AuthContext.Provider value={{ authenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};
