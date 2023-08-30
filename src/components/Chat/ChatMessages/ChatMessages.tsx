'use client'

import React, { useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import '@/libs/styles/chatMessages.styles.scss'
import { pusherClient } from '@/libs/pusher/pusher'
import { toPusherKey } from '@/libs/utils'


type ChatMessagesProps = {
    roomId: string,
    initialMessages: Message[],
    sendername: string
}

function ChatMessages({ roomId, initialMessages, sendername }: ChatMessagesProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const scrollDownRef = useRef<HTMLDivElement | null>(null)

    const formatTimestamp = (timestamp: number) => {
        return format(timestamp, 'HH:mm/dd.MM')
    }

    useEffect(() => {

        pusherClient.subscribe(
            toPusherKey(`room:${roomId}`)
        )

        const messageHandler = (message: Message) => {
            setMessages((prev) => [message, ...prev])
            console.log('new message')
        }

        pusherClient.bind('incoming_message', messageHandler)

        return () => {
            pusherClient.unsubscribe(toPusherKey(`room:${roomId}`))
            pusherClient.unbind('incoming_message', messageHandler)
        }
    }, [roomId])


    return (
        <div ref={scrollDownRef} className='messages'>
            {
                messages.map((message) => {
                    const isCurrentUser = message.senderUsername === sendername
                    const timestamp = formatTimestamp(message.timestamp)
                    const [minutes, days] = timestamp.split('/')
                    console.log('isCurrentUser', isCurrentUser)
                    return (

                        <div className='message__body' key={`${message.id}-${message.timestamp}`} >
                            <div className={`message__text-container ${isCurrentUser ? ' text-right' : 'text-left'}`}>
                                <p className='message__text'>{message.text}
                                </p>
                            </div>
                            <div className={`message__about ${isCurrentUser ? 'about-right' : 'about-left'}`}>
                                <p className='message__user'>{message.senderUsername}</p>
                                <div className='message__timestamp'>
                                    <p className='minutes'>{minutes}</p>
                                    <p className='days'>/{days}</p>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ChatMessages