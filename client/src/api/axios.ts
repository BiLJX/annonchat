import instance from "axios"

export const URI = "http://localhost:4000/"

const axios = instance.create({
    baseURL: URI,
    withCredentials: true,
    headers: { 'Access-Control-Allow-Origin': '*' }
})

export default axios