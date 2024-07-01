import { createClient } from "redis"

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT||"0")
    }
});

client.on('error', (err) => console.log('Redis Client Error', err));
export { client as redis }