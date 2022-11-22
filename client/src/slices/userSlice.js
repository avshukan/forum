/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import loginThunk from './loginThunk';

const initialState = {
  id: 0,
  username: 'Guest',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state, _action) => {
      const { id, username } = initialState;
      state.id = id;
      state.username = username;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state, action) => {
        const { payload: { id, username } } = action;
        state.id = id;
        state.username = username;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        const { payload } = action;
        console.log('rejected payload', payload);
        const { id, username } = initialState;
        state.id = id;
        state.username = username;
      });
  },
});

export const {
  logout,
} = userSlice.actions;

export default userSlice.reducer;
