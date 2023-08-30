import { fetchRedis } from "@/helper/redis";
import { authOptions } from "@/libs/auth";
import { db } from "@/libs/db";
import { pusherServer } from "@/libs/pusher/pusher";
import { toPusherKey } from "@/libs/utils";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session)
            return new Response('Unauthorized', { status: 401 })

        const { roomId } = await req.json()

        const username = session.user.name
        const userRoomsDb = await fetchRedis('zrange', `user:${username}:rooms`, 0, -1) as string[]

        if (!(userRoomsDb.includes(roomId)))
            return new Response('Bad Request', { status: 400 })

        pusherServer.trigger(toPusherKey(`user:${session.user.name}:rooms`),'delete_room',roomId)
        
        db.zrem(`user:${username}:rooms`,roomId)

        return new Response('OK', { status: 200 })
    } catch (e) {

        return new Response('error', { status: 400 })

    }
}