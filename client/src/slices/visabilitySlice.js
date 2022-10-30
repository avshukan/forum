/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  comments: [],
  commenter: false,
  poster: false,
};

const visabilitySlice = createSlice({
  name: 'visability',
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
      state.commenter = postId;
    },
    hideCommenter: (state, _action) => {
      state.commenter = false;
    },
    showPoster: (state, _action) => {
      state.poster = true;
    },
    hidePoster: (state, _action) => {
      state.poster = false;
    },
  },
});

export const {
  showComments,
  hideComments,
  showCommenter,
  hideCommenter,
  showPoster,
  hidePoster,
} = visabilitySlice.actions;

export default visabilitySlice.reducer;
