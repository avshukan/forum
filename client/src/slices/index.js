import { configureStore } from '@reduxjs/toolkit';
import dataSlice from './dataSlice';
import visabilitySlice from './visabilitySlice';

const store = configureStore({
  reducer: {
    data: dataSlice,
    visability: visabilitySlice,
  },
});

export default store;
