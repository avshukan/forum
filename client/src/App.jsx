import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AuthProvider from './contexts/AuthProvider';
import Header from './components/Header';
import Footer from './components/Footer';
import Forum from './components/Forum';

function App() {
  return (
    <AuthProvider>
      <div className="d-flex flex-column h-100">
        <Header />
        <Forum />
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
