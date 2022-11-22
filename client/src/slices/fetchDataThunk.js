import { createAsyncThunk } from '@reduxjs/toolkit';
import { getPosts } from '../api';

export default createAsyncThunk(
  'data/fetchData',
  async (_args, { rejectWithValue }) => {
    const response = await getPosts();
    if (!response.ok) {
      console.log('response.error', response.error);
      return rejectWithValue(response.data);
    }
    const posts = await response.json();
    return posts;
  },
);
