import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { gapi } from 'gapi-script';
import { Button } from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa';
import googleThunk from '../slices/googleThunk';

const { REACT_APP_GOOGLE_ID } = process.env;

function AuthGoogle() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const signIn = async () => {
    const auth2 = gapi.auth2.getAuthInstance();
    const googleUser = await auth2.signIn();

    googleUser.disconnect();

    const { id_token: idToken } = googleUser.getAuthResponse();
    dispatch(googleThunk({ idToken }));
    // const response = dispatch(loginThunk({ username, password }));
    // if (response.status === 201) {
    //   do something
    // }
    navigate('/');
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
    <div className="text-center my-3">
      <div className="text-center my-3">
        <Button onClick={signIn} variant="light">
          <div className="d-inline-flex p-2 me-2">
            <FaGoogle />
          </div>
          <span className="p-2">Login with Google</span>
        </Button>
      </div>
    </div>
  );
}

export default AuthGoogle;
