'use client'

import axios, { AxiosResponse } from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type JoinRoomProps = {
    userRooms: string
}

function CreateRoom({userRooms}:JoinRoomProps) {
    const router = useRouter()

    const onSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
        try{
            e.preventDefault()
            if(userRooms.length>5)
                return 'Exceeded Amount of Rooms'
            const res = (await axios.post('/api/room/create'))
            if(res.status !== 200)
                return 'server error'

            console.log(res)
            const roomId = res.data

            return router.push(`/room/${roomId}`)

        }catch(e){

        }
    }

    return (
        <div>
            <form action="" onSubmit={onSubmit}>
                <button>create room</button>
            </form>
        </div>
    )
}

export default CreateRoom