import ChatInput from '@/components/Chat/ChatInput/ChatInput'
import ChatMessages from '@/components/Chat/ChatMessages/ChatMessages'
import { fetchRedis } from '@/helper/redis'
import { authOptions } from '@/libs/auth'
import { messageArrayValidator } from '@/libs/validators/messageValidator'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import React from 'react'
import '@/libs/styles/roomChat.styles.scss'
import ParticipantsList from '@/components/Chat/ParticipantsList/ParticipantsList'

type RoomChatProps = {
  params: {
    roomId: string
  }
}

async function getChatMessages(roomId: string) {
  try {
    const results: string[] = await fetchRedis('zrange', `room:${roomId}:messages`, 0, -1)

    const dbMessages = results.map((message) => JSON.parse(message) as Message)

    const messagesRev = messageArrayValidator.parse(dbMessages)
    const messages = messagesRev.reverse()
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

  const isIn = await fetchRedis('zscore', `user:${session.user.name}:rooms`, roomId)
  if (!isIn) notFound()

  const initialMessages = await getChatMessages(roomId)
  const participants = await fetchRedis('zrange', `room:${roomId}:users`, 0, -1) as string[]

  console.log('init messages', initialMessages)
  console.log('params', roomId)
  console.log('roomId session', session)


  return (
    <main>
        <ParticipantsList roomId={roomId} initialParticipants={participants} />
      <div>
        <div className='room__title'>
          <p>room</p>
          <p>{roomId}</p>
        </div>
        <div className='room__chat'>
          <div className='chat__messages'>
            <ChatMessages roomId={roomId} initialMessages={initialMessages} sendername={session.user.name!} />
            <div className='chat-input-container'>
              <ChatInput roomId={roomId} />
            </div>
          </div>
        </div>
      </div>
      <div>

      </div>
    </main>
  )
}

export default RoomChat