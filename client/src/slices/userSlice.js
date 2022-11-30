/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import loginThunk from './loginThunk';
import githubThunk from './githubThunk';
import googleThunk from './googleThunk';

const initialState = {
  id: 0,
  username: 'Guest',
  picture: '/images/unknown.png',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state, _action) => {
      const { id, username, picture } = initialState;
      state.id = id;
      state.username = username;
      state.picture = picture;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state, action) => {
        const { payload: { id, username, picture } } = action;
        state.id = id;
        state.username = username;
        state.picture = picture ?? initialState.picture;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        const { payload } = action;
        console.log('rejected payload', payload);
        const { id, username, picture } = initialState;
        state.id = id;
        state.username = username;
        state.picture = picture;
      })
      .addCase(googleThunk.fulfilled, (state, action) => {
        const { payload: { id, username, picture } } = action;
        state.id = id;
        state.username = username;
        state.picture = picture ?? initialState.picture;
      })
      .addCase(googleThunk.rejected, (state, action) => {
        const { payload } = action;
        console.log('rejected payload', payload);
        const { id, username, picture } = initialState;
        state.id = id;
        state.username = username;
        state.picture = picture;
      })
      .addCase(githubThunk.fulfilled, (state, action) => {
        const { payload: { id, username, picture } } = action;
        state.id = id;
        state.username = username;
        state.picture = picture ?? initialState.picture;
      })
      .addCase(githubThunk.rejected, (state, action) => {
        const { payload } = action;
        console.log('rejected payload', payload);
        const { id, username, picture } = initialState;
        state.id = id;
        state.username = username;
        state.picture = picture;
      });
  },
});

export const {
  logout,
} = userSlice.actions;

export default userSlice.reducer;
