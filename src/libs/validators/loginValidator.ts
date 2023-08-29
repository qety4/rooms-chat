import {z} from 'zod'

export const loginValidator = z.object({
    username:z.string().length(4),
    password:z.string().length(8),
})