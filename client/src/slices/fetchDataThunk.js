import { createAsyncThunk } from '@reduxjs/toolkit';
import { getPosts } from '../api';

export default createAsyncThunk(
  'data/fetchData',
  async (token, { rejectWithValue }) => {
    const response = await getPosts(token);
    if (!response.ok) {
      console.log('response.error', response.error);
      return rejectWithValue(response.data);
    }
    const posts = await response.json();
    return posts;
  },
);
