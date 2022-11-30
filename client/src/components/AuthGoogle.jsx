import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { gapi } from 'gapi-script';
import GoogleLogin from 'react-google-login';
import googleThunk from '../slices/googleThunk';

const { REACT_APP_GOOGLE_ID } = process.env;

function AuthGoogle() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const onSuccess = (googleUser) => {
    // var profile = googleUser.getBasicProfile();
    googleUser.disconnect();
    const { id_token: idToken } = googleUser.getAuthResponse();
    dispatch(googleThunk({ idToken }));
    // const response = dispatch(loginThunk({ username, password }));
    // if (response.status === 201) {
    //   do something
    // }
    navigate('/');
  };

  const onFailure = (error) => {
    console.log(error);
  };

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: REACT_APP_GOOGLE_ID,
        scope: 'profile email',
        plugin_name: 'streamy',
      });
    };
    gapi.load('client:auth2', initClient);
  });

  return (
    <div className="text-center">
      <GoogleLogin
        clientId={REACT_APP_GOOGLE_ID}
        onSuccess={onSuccess}
        onFailure={onFailure}
        isSignedIn
      >
        {/* <FontAwesome name='google' /> */}
        <span> Login with Google</span>
      </GoogleLogin>
    </div>
  );
}

export default AuthGoogle;
