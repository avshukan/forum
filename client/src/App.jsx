import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Provider } from 'react-redux';
import AuthProvider from './contexts/AuthProvider';
import store from './slices';
import Main from './components/Main';

function App() {
  return (
    <AuthProvider>
      <Provider store={store}>
        <Main />
      </Provider>
    </AuthProvider>
  );
}

export default App;
