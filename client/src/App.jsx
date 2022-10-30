import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Provider } from 'react-redux';
import { Container } from 'react-bootstrap';
import AuthProvider from './contexts/AuthProvider';
import Header from './components/Header';
import Brand from './components/Brand';
import Footer from './components/Footer';
import Forum from './components/Forum';
import store from './slices';

function App() {
  return (
    <AuthProvider>
      <Provider store={store}>
        <Container className="d-flex flex-column h-100 App-area mx-auto">
          <Header />
          <Brand />
          <Forum />
          <Footer />
        </Container>
      </Provider>
    </AuthProvider>
  );
}

export default App;
