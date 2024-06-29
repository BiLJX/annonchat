declare interface TReduxAsyncState<T>{
    data: T
    is_loading: boolean,
    error: boolean;
    message?: string
}