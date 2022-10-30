import React, {
  useContext, useMemo, useState, createContext,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [username, setUsername] = useState('');

  const logIn = useCallback((user) => {
    localStorage.setItem('username', user);
    setUsername(user);
  });

  const logOut = useCallback(() => {
    localStorage.removeItem('username');
    setUsername('');
  });

  useEffect(() => {
    const user = localStorage.getItem('username');
    if (user) {
      setUsername(user);
    }
  });
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
