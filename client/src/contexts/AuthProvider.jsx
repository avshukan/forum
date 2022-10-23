import React, {
  useContext, useMemo, useState, createContext,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [username, setUsername] = useState('');

  const logIn = useCallback((user) => {
    setUsername(user);
  });

  const logOut = useCallback(() => setUsername(''));

  const value = useMemo(() => ({ username, logIn, logOut }), [username]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.shape({}),
};

AuthProvider.defaultProps = () => { };

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
