/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import fetchDataThunk from './fetchDataThunk';

const initialState = {
  posts: [],
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  // reducers: {
  //   addChannel: (state, action) => {
  //     state.channels.push(action.payload);
  //   },
  // },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataThunk.fulfilled, (state, action) => {
        const { payload } = action;
        console.log('fetchDataThunk.fulfilled payload', payload);
        if (!_.isEmpty(payload)) {
          state.posts = [...payload];
        }
      })
      .addCase(fetchDataThunk.rejected, (state, action) => {
        const { payload } = action;
        console.log('fetchDataThunk.rejected payload', payload);
      });
  },
});

// export const {
//   addChannel,
// } = dataSlice.actions;

export default dataSlice.reducer;
