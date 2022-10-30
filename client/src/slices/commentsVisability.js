/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import fetchDataThunk from './fetchDataThunk';

const initialState = {
  commenters: [],
  comments: [],
};

const commentsVisabilitySlice = createSlice({
  name: 'commentsVisability',
  initialState,
  reducers: {
    showComments: (state, action) => {
      const { postId } = action.payload;
      state.comments[postId] = true;
    },
    hideComments: (state, action) => {
      const { postId } = action.payload;
      state.comments[postId] = false;
    },
    showCommenter: (state, action) => {
      const { postId } = action.payload;
      state.commenters[postId] = true;
    },
    hideCommenter: (state, action) => {
      const { postId } = action.payload;
      state.commenters[postId] = false;
    },
  },
});

export const {
  showComments,
  hideComments,
  showCommenter,
  hideCommenter,
} = commentsVisabilitySlice.actions;

export default commentsVisabilitySlice.reducer;
