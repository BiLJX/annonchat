declare interface TReduxAsyncState<T>{
    data: T,
    is_loading: boolean,
    error: boolean|null,
    message?: string
}