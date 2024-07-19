import { configureStore } from '@reduxjs/toolkit'
import userReducer from './featuers/user.slice'
import randomChatReducer from "./featuers/random.slice"
import randomCallSlice from './featuers/randomCall.slice';


// const loggerMiddleware = (store: any) => (next: any) => (action: any) => {
//     console.log('Dispatching action:', action);
//     let result = next(action);
//     console.log('Next state:', store.getState());
//     return result;
//   };

export const store = configureStore({
    reducer: {
        user: userReducer,
        randomChat: randomChatReducer,
        randomCall: randomCallSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})//.concat(loggerMiddleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch