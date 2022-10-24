import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AuthProvider from './contexts/AuthProvider';
import dataSlice from './slices/dataSlice';
import Header from './components/Header';
import Footer from './components/Footer';
import Forum from './components/Forum';

const store = configureStore({
  reducer: {
    data: dataSlice,
  },
});

function App() {
  return (
    <AuthProvider>
      <Provider store={store}>
        <div className="d-flex flex-column h-100">
          <Header />
          <Forum />
          <Footer />
        </div>
      </Provider>
    </AuthProvider>
  );
}

export default App;
