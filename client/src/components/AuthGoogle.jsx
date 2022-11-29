import React from 'react';
import { useDispatch } from 'react-redux';
import GoogleLogin from 'react-google-login';
import googleThunk from '../slices/googleThunk';

const { REACT_APP_GOOGLE_ID } = process.env;

function AuthGoogle() {
  const dispatch = useDispatch();

  const responseGoogle = (googleUser) => {
    console.log(googleUser);
    const profile = googleUser.getBasicProfile();
    console.log(profile);
    const { id_token: idToken } = googleUser.getAuthResponse();
    console.log(`ID Token: ${idToken}`);
    dispatch(googleThunk({ idToken }));
  };

  return (
    <GoogleLogin
      clientId={REACT_APP_GOOGLE_ID}
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
    >
      {/* <FontAwesome name='google' /> */}
      <span> Login with Google</span>
    </GoogleLogin>
  );
}

export default AuthGoogle;
