/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import loginThunk from './loginThunk';

const initialState = {
  token: '',
  id: 0,
  username: 'Guest',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state, _action) => {
      const { token, id, username } = initialState;
      state.token = token;
      state.id = id;
      state.username = username;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state, action) => {
        const { payload: { token, id, username } } = action;
        state.token = token;
        state.id = id;
        state.username = username;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        const { payload } = action;
        console.log('rejected payload', payload);
        state.token = payload.token;
        state.id = payload.id;
        state.username = payload.username;
      });
  },
});

export const {
  logout,
} = userSlice.actions;

export default userSlice.reducer;
