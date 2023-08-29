'use client'

import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import '@/libs/styles/chatInput.styles.scss'
import { Send } from 'lucide-react'

function ChatInput({ roomId }: { roomId: string }) {
    const [input, setInput] = useState<string>('')
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    useEffect(()=>{
        textareaRef.current?.focus()
    },[])

    const sendMessage = async () => {
        try {
            if (input === '')
                return
            const res = await axios.post('/api/message/send', { text: input, roomId })
            setInput('')
        } catch (e) {

        }
    }

    return (
        <div className='chatInput-container'>
            <TextareaAutosize
                className='chatInput'
                name=""
                id=""
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault
                        sendMessage()
                    }
                }}
                rows={1}
                cols={1}
                placeholder='your message...'
                onChange={(e) => setInput(e.target.value)}
                value={input}
                ref={textareaRef}
            />
            
            <button className='chatInput__btn' onClick={sendMessage}>
                send
            </button>
        </div>
    )
}

export default ChatInput