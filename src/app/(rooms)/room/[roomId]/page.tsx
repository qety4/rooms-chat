import { fetchRedis } from '@/helper/redis'
import { authOptions } from '@/libs/auth'
import { messageArrayValidator } from '@/libs/validators/messageValidator'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import React from 'react'

type RoomChatProps = {
  params: {
    roomId: string
  }
}

async function getChatMessages(roomId: string) {
  try {
    const results: string[] = await fetchRedis('zrange', `chat:${roomId}:messages`, -1, 0)

    const dbMessages = results.map((message) => JSON.parse(message) as Message)

    const messages = messageArrayValidator.parse(dbMessages)
    console.log('getChatMessages', messages)
    return messages
  } catch (e) {
    notFound()
  }
}

async function RoomChat({ params }: RoomChatProps) {
  const session = await getServerSession(authOptions)
  if (!session) notFound()
  const roomId: string = params.roomId
  const isIn = await fetchRedis('sismember', `user:${session.user.name}:rooms`, roomId)
  if (!isIn) notFound()
  const initialMessages = await getChatMessages(roomId)


  console.log('params', roomId)
  console.log('roomId session', session)

  return (
    <main>
      <div>
        <p>room {roomId}</p>
        <div>
          <div>
            <ChatMessages chatId={roomId} initialMessages={initialMessages} sessionId={session.user.id} />
          </div>
          <ChatInput roomId={roomId} />
        </div>
      </div>
    </main>
  )
}

export default RoomChat