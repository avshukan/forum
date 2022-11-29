import React, { useEffect } from 'react';

const { REACT_APP_GOOGLE_ID } = process.env;

function GoogleSign() {
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

  const signIn = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();

    // auth2.grantOfflineAccess()
    //   .then((authResult) => {
    //     console.log('authResult', authResult)
    //     if (authResult['code']) {
    //       // Hide the sign-in button now that the user is authorized, for example:
    //       // $('#signinButton').attr('style', 'display: none');
    //       fetch('http://localhost:5000/api/v1/auth/google/callback', {
    //         method: 'POST',
    //         credentials: 'include',
    //         headers: { 'Content-Type': 'application/json;charset=utf-8' },
    //         body: JSON.stringify(authResult),
    //       })
    //         .then(result => {
    //           console.log('then result');
    //           return result.json()
    //         })
    //         .then(data => console.log('then data', data))
    //         .catch(error => console.log('fetch error callback', error))
    //     } else {
    //       console.log('code is empty')
    //       // There was an error.
    //     }
    //   });

    auth2.signIn().then((googleUser) => {
      // метод возвращает объект пользователя
      // где есть все необходимые нам поля
      const profile = googleUser.getBasicProfile();

      console.log('profile', profile);
      console.log('Object.keys(profile)', Object.keys(profile));
      console.log(`ID: ${profile.getId()}`); // не посылайте подобную информацию напрямую, на ваш сервер!
      console.log(`Full Name: ${profile.getName()}`);
      console.log(`Given Name: ${profile.getGivenName()}`);
      console.log(`Family Name: ${profile.getFamilyName()}`);
      console.log(`Image URL: ${profile.getImageUrl()}`);
      console.log(`Email: ${profile.getEmail()}`);

      // токен
      const { id_token: idToken } = googleUser.getAuthResponse();
      console.log(`ID Token: ${idToken}`);
      fetch('http://localhost:5000/api/v1/auth/google/signtoken', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify({ idToken }),
      })
        .then((result) => {
          console.log('then result');
          return result.json();
        })
        .then((data) => console.log('then data', data))
        .catch((error) => console.log('fetch error callback', error));
    });
  };

  const signOut = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      console.log('User signed out.');
    });
  };

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
