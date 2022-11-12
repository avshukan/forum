import { createAsyncThunk } from '@reduxjs/toolkit';
import { login } from '../api';

export default createAsyncThunk(
  'user/login',
  (authData) => login(authData).then((response) => response.json()),
);
