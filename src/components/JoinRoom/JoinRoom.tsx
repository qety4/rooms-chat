'use client'

import { db } from '@/libs/db'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type JoinRoomProps = {
    userRooms: string
}


function JoinRoom({ userRooms }: JoinRoomProps) {
    const [value,setValue]=useState<string>('')
    const router =useRouter()

    const onSubmit= async (e:React.FormEvent<HTMLFormElement>)=>{
        try{
            e.preventDefault()

            if(value.replace(/\s+/g, "") === '' && value.length < 2)
                return 'Invalid Input'
            if(userRooms.length>5)
                return console.log('room limit exceeded')
            if(userRooms.includes(value))
                return router.push(`/room/${value}`)

            const res= await axios.post('/api/room/join',{
                roomId:value,
            })

            if(res.status !== 200)
                return 'Server Error'

            return router.push(`/room/${value}`)
        }catch(e){
            console.log('submit error',e)
        }
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" onChange={(e)=>setValue(e.target.value)}/>
                <button>submit</button>
            </form>
        </div>
    )
}

export default JoinRoom