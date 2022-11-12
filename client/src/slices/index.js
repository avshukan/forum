import { configureStore } from '@reduxjs/toolkit';
import dataSlice from './dataSlice';
import userSlice from './userSlice';
import visabilitySlice from './visabilitySlice';

const store = configureStore({
  reducer: {
    data: dataSlice,
    user: userSlice,
    visability: visabilitySlice,
  },
});

export default store;
