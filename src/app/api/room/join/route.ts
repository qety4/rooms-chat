import { fetchRedis } from "@/helper/redis"
import { authOptions } from "@/libs/auth"
import { db } from "@/libs/db"
import { getServerSession } from "next-auth"


export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if(!session)
            return new Response('Unauthorized',{status:401})
        
        const { roomId } = await req.json()

        const exists = await fetchRedis('sismember', `rooms:roomlist`, roomId)

        if (!exists)
            return new Response('Room doesnt exist', { status: 400 })

        
        await db.sadd(`user:${session.user.name}:rooms`)
        await db.sadd(`room:${roomId}:users`, session.user.name)

        return new Response('OK', { status: 200 })
    } catch (e) {
        return new Response('error', { status: 400 })
    }

}