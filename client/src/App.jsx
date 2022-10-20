import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="d-flex flex-column h-100">
      <Header />
      <Forum />
      <Footer />
    </div>
  );
}

export default App;
