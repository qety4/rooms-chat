'use client'

import axios, { AxiosResponse } from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import '@/libs/styles/createRoom.styles.scss'

type JoinRoomProps = {
    userRooms: string[]
}

function CreateRoom() {
    const router = useRouter()

    const onSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
        try{
            e.preventDefault()
            const res = (await axios.post('/api/room/create'))
            console.log(res)
            
            if(res.status !== 200)
                return 'server error'

            const roomId = res.data

            return router.push(`/room/${roomId}`)

        }catch(e){

        }
    }

    return (
        <div className='create-room__form-container'>
            <form action="" className='create-room__form' onSubmit={onSubmit}>
                <h3 className='create-room__title'>Create Room</h3>
                <button className='create-room__btn'>create room</button>
            </form>
        </div>
    )
}

export default CreateRoom