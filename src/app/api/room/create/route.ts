
import { nanoid } from 'nanoid'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { db } from '@/libs/db'
import { fetchRedis} from '@/helper/redis'
import { timeStamp } from 'console'

export async function POST() {
    try {
        const session = await getServerSession(authOptions)

        if (!session)
            return new Response('Unauthorized', { status: 401 })

        const username = session.user.name
        const userRoomsDb = await fetchRedis('zrange',`user:${username}:rooms` , 0, -1) as string[] 

        if ( userRoomsDb?.length === 10)
            return new Response('User room limit exceeded', { status: 400 })

        const timestamp = Date.now()
        const roomId = nanoid()


        await db.zadd(`user:${session.user.name}:rooms`, {
            score: timestamp,
            member:roomId
        })

        await db.zadd(`room:${roomId}:users`, {
            score: timestamp,
            member: session.user.name
        })

        await db.sadd(`rooms:roomlist`,roomId)

        return new Response(`${roomId}`, { status: 200 })

    } catch (e) {
        return new Response('Internal server error',{status: 500})
    }
}