import { createAsyncThunk } from '@reduxjs/toolkit';
import { githubSigntoken } from '../api';

export default createAsyncThunk(
  'user/github',
  (data) => githubSigntoken(data).then((response) => response.json()),
);
