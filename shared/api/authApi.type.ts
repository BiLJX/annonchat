export interface TSignupRequest {
    email: string,
    password: string,
    username: string,
    bio: string
}

export interface TSignupResponse {
    user_id: string,
    username: string,
    is_verified: boolean,
    account_setup: boolean,
    pfp_url: string,
    bio: string,
}


export interface TLoginRequest {
    username: string,
    password: string
}

export interface TloginResponse extends TSignupResponse {

}