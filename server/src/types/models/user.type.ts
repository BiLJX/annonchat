export interface TUser {
    user_id: string,
    username: string,
    email: string,
    is_verified: boolean,
    account_setup: boolean,
    pfp_url: string,
    bio: string,
    password: string
}