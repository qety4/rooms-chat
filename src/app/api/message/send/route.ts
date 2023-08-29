import { authOptions } from "@/libs/auth"
import { getServerSession } from "next-auth"
import { z } from "zod"
import {nanoid} from 'nanoid'
import { messageValidator } from "@/libs/validators/messageValidator"
import { db } from "@/libs/db"
import { fetchRedis } from "@/helper/redis"
import { pusherServer } from "@/libs/pusher/pusher"
import { toPusherKey } from "@/libs/utils"
export async function POST(req: Request) {
    try {

        const session = await getServerSession(authOptions)

        if (!session)
            return new Response('Not Authorized', { status: 401 })

        const senderUsername =session.user.name as string   

        const {text,roomId} = await req.json()

        const isIn = await fetchRedis(`zscore`,`room:${roomId}:users`,senderUsername)
        if(!isIn)
            return new Response('Unauthorized Sender',{status:401})

        const timestamp = Date.now()
        const messageId = nanoid()
        
        const messageData:Message = {
            senderUsername:senderUsername,
            text:text,
            timestamp:timestamp,
            id:messageId
        }

        const message = messageValidator.parse(messageData)
    
        pusherServer.trigger(toPusherKey(`room:${roomId}`),'incoming_message',message)

        await db.zadd(`room:${roomId}:messages`,{
            score:timestamp,
            member:JSON.stringify(message)}
        )

        return new Response('OK', { status: 200 })
    } catch (e) {
        new Response('Internal Server Error',{status:500})
    }

}