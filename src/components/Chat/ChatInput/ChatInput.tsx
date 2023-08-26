'use client'

import axios from 'axios'
import React, { useState } from 'react'

function ChatInput({roomId}:{roomId:string}) {
    const [input,setInput] = useState<string>('')

    const sendMessage = async () => {
        try {
            if (input === '')
                return
            await axios.post('/api/message/send', { text: input, roomId })
            setInput('')
        } catch (e) {

        }
    }

    return (
        <div>
            <textarea name="" id=""
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault
                        sendMessage()
                    }
                }}
                onChange={(e)=>setInput(e.target.value)}
            >

            </textarea>

        </div>
    )
}

export default ChatInput