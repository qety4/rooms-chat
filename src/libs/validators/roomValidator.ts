import {z} from 'zod'

export const roomValidator = z.object({
    room:z.string().nonempty('enter a valid room').length(21)
})