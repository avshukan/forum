import { createAsyncThunk } from '@reduxjs/toolkit';
import { getPosts } from '../api';

export default createAsyncThunk(
  'data/fetchData',
  async (username) => getPosts(username),
);
