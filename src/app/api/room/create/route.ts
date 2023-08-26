
import { nanoid } from 'nanoid'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { db } from '@/libs/db'

export async function POST() {
    try {
        const session = await getServerSession(authOptions)

        if (!session)
            return new Response('Unauthorized', { status: 401 })

        const roomId = nanoid()
        
        await db.sadd(`user:${session.user.name}:rooms`,roomId)
        await db.sadd(`room:${roomId}:users`, session.user.name)
        await db.sadd(`rooms:roomlist`, roomId)

        return new Response(`${roomId}`,{status:200})

    } catch (e) {

    }
}