export interface TMessageModel {
    message_id: string,
    conversation_id: string,
    author_id: string,
    message: string,
    seen_by: string[]
}