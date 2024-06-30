import { configureStore } from '@reduxjs/toolkit'
import userReducer from './featuers/user.slice'
import randomChatReducer from "./featuers/random.slice"
export const store = configureStore({
    reducer: {
        user: userReducer,
        randomChat: randomChatReducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch