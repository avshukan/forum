import { createAsyncThunk } from '@reduxjs/toolkit';
import { googleSigntoken } from '../api';

export default createAsyncThunk(
  'user/google',
  (data) => googleSigntoken(data).then((response) => response.json()),
);
