import {z} from 'zod'

export const roomValidator = z.object({
    room:z.string().length(21)
})