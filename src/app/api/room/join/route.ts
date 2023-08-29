import { fetchRedis} from "@/helper/redis"
import { authOptions } from "@/libs/auth"
import { db } from "@/libs/db"
import { pusherServer } from "@/libs/pusher/pusher"
import { toPusherKey } from "@/libs/utils"
import { getServerSession } from "next-auth"


export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session)
            return new Response('Unauthorized', { status: 401 })

        const { roomId } = await req.json()

        const exists = await fetchRedis('sismember', `rooms:roomlist`, roomId)

        if (!exists)
            return new Response('Room doesnt exist', { status: 400 })

        const username = session.user.name
        const userRoomsDb =await fetchRedis('zrange',`user:${username}:rooms` , 0, -1) as string[]

        if(userRoomsDb.length===10)
            return new Response('User room limit exceeded',{status:200})

        if(userRoomsDb.includes(roomId))
            return new Response('User Already in Room', {status:201})

        const timestamp = Date.now()

        pusherServer.trigger(toPusherKey(`room:${roomId}:users`),'new_user',session.user.name)

        await db.zadd(`user:${session.user.name}:rooms`, {
            score: timestamp,
            member: roomId
        })

        await db.zadd(`room:${roomId}:users`, {
            score: timestamp,
            member: session.user.name
        })

        return new Response('OK', { status: 200 })
    } catch (e) {
        return new Response('error', { status: 400 })
    }

}