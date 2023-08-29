import {z} from 'zod'

export const messageValidator= z.object({
    id:z.string(),
    text:z.string().max(800),
    timestamp:z.number(),
    senderUsername:z.string()
})

export const messageArrayValidator = z.array(messageValidator)

export type Message =  z.infer<typeof messageValidator>