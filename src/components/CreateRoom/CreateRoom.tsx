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
    const [error,setError] = useState<string>()
    const onSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
        try{
            e.preventDefault()
            const res = (await axios.post('/api/room/create'))
            
            if(res.status === 400 )
                throw new Error('limit of rooms exceeded')

            if(res.status !== 200)
                throw new Error('internal server error')
            
            const roomId = res.data

            return router.push(`/room/${roomId}`)

        }catch(e){
            setError(e as string)
        }
    }

    return (
        <div className='create-room__form-container'>
            <form action="" className='create-room__form' onSubmit={onSubmit}>
                <h3 className='create-room__title'>Create Room</h3>
                <button className='create-room__btn'>create room</button>
            </form>
            <p>{error}</p>
        </div>
    )
}

export default CreateRoom