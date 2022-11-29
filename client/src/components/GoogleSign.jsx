import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import googleThunk from '../slices/googleThunk';

const { REACT_APP_GOOGLE_ID } = process.env;

function GoogleSign() {
  const dispatch = useDispatch();

  const signIn = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signIn().then((googleUser) => {
      // метод возвращает объект пользователя
      // где есть все необходимые нам поля
      const profile = googleUser.getBasicProfile();

      console.log(`ID: ${profile.getId()}`); // не посылайте подобную информацию напрямую, на ваш сервер!
      console.log(`Full Name: ${profile.getName()}`);
      console.log(`Given Name: ${profile.getGivenName()}`);
      console.log(`Family Name: ${profile.getFamilyName()}`);
      console.log(`Image URL: ${profile.getImageUrl()}`);
      console.log(`Email: ${profile.getEmail()}`);

      // токен
      const { id_token: idToken } = googleUser.getAuthResponse();
      console.log(`ID Token: ${idToken}`);
      dispatch(googleThunk({ idToken }));
    });
  };

  const signOut = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      console.log('User signed out.');
    });
  };

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: REACT_APP_GOOGLE_ID,
        scope: 'email profile',
        plugin_name: 'streamy',
      });
    };
    gapi.load('client:auth2', initClient);
  });

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={signIn}>Log in</button>
        <button onClick={signOut}>Log out</button>
      </header>
    </div>
  );
}

export default GoogleSign;
