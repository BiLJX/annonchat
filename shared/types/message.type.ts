export interface TMessage {
    message_id: string,
    conversation_id: string,
    author_data: {
        user_id: string,
        pfp_url: string,
        username: string
    }
    message: string,
    seen_by: string[],
    sent_on: Date
}