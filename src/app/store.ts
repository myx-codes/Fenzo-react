import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import HomePageReducer from './screens/homePage/slice';
import reduxLogger from 'redux-logger';

export const store = configureStore({
  middleware: (getDefaultMiddleware) => 
   
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(reduxLogger as any),
  reducer: {
    homePage: HomePageReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
